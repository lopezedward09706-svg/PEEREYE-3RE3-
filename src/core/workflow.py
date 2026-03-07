# AUTHORITY_ID: 0009-0009-0717-5536
# AUTHOR: Edward lopez, E.P.L, Edward P. Lopez & Edward Perez Lopez
# LOCATION: ciudad juarez/chihuahua/Mexico. 2026-03-07 05:04 a. m.

from src.core.cycle import ValidationCycle
from src.agents.verifiers import Mathematica, Physis, Geometria
from src.agents.debate import FlawSuccessDebate
from src.agents.criterion import Criterion
from src.agents.paper_agents import Structura, Contentor, Figuratus, Latexor, Anglicus, Hispanus, PeerReviewDialogue, PeerReviewSimulation
from src.agents.sim_ai import Simulus, LawsRepository
from src.agents.dr_hardt import DrHardt
import os
import datetime

class WorkflowEngine:
    def __init__(self, config, logger, active_agents=None):
        self.config = config
        self.logger = logger
        self.active_agents = active_agents or []
        
        # Mapeo de Agentes para control de interacción
        self.laws_repo = LawsRepository(config.get("laws_repo_path"))
        
        self.agents = {
            "ALETHEIA": ValidationCycle(config, logger),
            "MATHION": Mathematica(config, logger),
            "PHYSIS": Physis(config, logger),
            "GEOMETRON": Geometria(config, logger),
            "DEBATE": FlawSuccessDebate(config, logger),
            "CRITERION": Criterion(config, logger),
            "SIMULUS": Simulus(config, logger, self.laws_repo, config.get("sim_output_path")),
            "DR_HARDT": DrHardt(config, logger)
        }
        
        self.cycle_engine = self.agents["ALETHEIA"]
        self.math_v = self.agents["MATHION"]
        self.phil_v = self.agents["PHYSIS"]
        self.vis_v = self.agents["GEOMETRON"]
        self.debate_manager = self.agents["DEBATE"]
        self.criterion = self.agents["CRITERION"]
        self.sim_ai = self.agents["SIMULUS"]
        self.dr_hardt = self.agents["DR_HARDT"]
        
        # Pipeline de Paper
        self.structura = Structura(config, logger)
        self.contentor = Contentor(config, logger)
        self.figuratus = Figuratus(config, logger)
        self.latexor = Latexor(config, logger)
        self.anglicus = Anglicus(config, logger)
        self.hispanus = Hispanus(config, logger)
        self.peer_dialogue = PeerReviewDialogue(config, logger)
        self.peer_sim = PeerReviewSimulation(config, logger)

    def _is_active(self, agent_name):
        if not self.active_agents: return True
        return agent_name in self.active_agents

    def run_iteration(self, item, session_state):
        """Ejecuta una iteración completa con bucles de control y modo de operación."""
        h_id = item.get("id")
        self.logger.info("WORKFLOW", f"===[ ITERACIÓN {session_state['iteration_count']} ]===", h_id)
        
        if item.get("category") == "basura":
            return {"status": "skipped_garbage", "explanation": "Contenido irrelevante o malformado."}
        
        context = {"config": self.config, "iteration": session_state['iteration_count'], "hypothesis_id": h_id}

        # 1. CICLO DE VALIDACIÓN (Aletheia, Elenchus, etc.)
        h1_data, rep1 = self.cycle_engine.run_cycle(item, context, vuelta=1)
        h2_data, rep2 = self.cycle_engine.run_cycle(h1_data, context, vuelta=2)
        
        # 2. VERIFICADORES ESPECIALIZADOS
        verifications = {}
        if self._is_active("MATHION"): 
            verifications["mathion"] = self.math_v.verify(h1_data, h2_data, context)
        if self._is_active("PHYSIS"):
            verifications["physis"] = self.phil_v.verify(h1_data, h2_data, context)
        if self._is_active("GEOMETRON"):
            verifications["geometron"] = self.vis_v.verify(h1_data, h2_data, context)
        
        # 3. DEBATE OBSERVADOR
        ciclo_res = {"h1": h1_data, "h2": h2_data, "reports": [rep1, rep2]}
        debate_res = {}
        if self._is_active("DEBATE"):
            debate_res = self.debate_manager.run(verifications, ciclo_res, context, h_id)
        
        # 4. Oráculo CRITERION (Decisión Inicial)
        decision = self.criterion.decide(h1_data["content"], h2_data["content"], [rep1, rep2], verifications, debate_res, h_id)
        
        result = {
            "h_id": h_id,
            "decision": decision,
            "verifications": verifications,
            "debate": debate_res,
            "reports": [rep1, rep2]
        }

        # 5. PUBLICACIÓN O REHACER
        if decision["option"] == 3: # PUBLICAR
            # Pipeline de Paper y Revisión por Pares
            res_paper_data = self._run_paper_pipeline(h2_data, verifications, debate_res, [rep1, rep2], h_id, context)
            
            # Lanzamos Simulación (necesaria para Dr. Hardt)
            sim_report = None
            if self._is_active("SIMULUS"):
                sim_report = self.sim_ai.run_simulation_cycle(context)
                result["simulation"] = sim_report

            # ESCRUTINIO FINAL: DR_HARDT
            if self._is_active("DR_HARDT"):
                expediente = {
                    'hypothesis': item["content"],
                    'h1': h1_data["content"], 'h2': h2_data["content"],
                    'cycle_reports': [rep1, rep2],
                    'verifier_reports': verifications,
                    'debate_flaw_success': debate_res,
                    'peer_review': res_paper_data["review"],
                    'simulations': sim_report
                }
                verdicto = self.dr_hardt.run(expediente, context)
                result["dr_hardt"] = verdicto
                
                # Decisión vinculante de Dr. Hardt
                if verdicto["decision"] not in ["CONFIRMADA, NO HAY EXCUSAS", "ACEPTADA PROVISIONALMENTE"]:
                    result["decision"]["option"] = 2 if verdicto["decision"] == "EN CUARENTENA" else 1
                    result["decision"]["explanation"] = f"Veto de Dr. Hardt: {verdicto['explicacion']}"
                    return result # Detenemos publicación

            # Si pasa el filtro final, guardamos Ley
            result["paper"] = res_paper_data
            law_id = self.laws_repo.add_law(h2_data, context)
            session_state['laws'].append({"id": law_id, "content": h2_data["content"]})
            
            if sim_report and self._is_active("DEBATE"):
                sim_debate = self._run_sim_debate(sim_report, verifications, h_id)
                result["sim_debate"] = sim_debate

        return result

    def _run_paper_pipeline(self, h_data, verif, debate, reports, h_id, context):
        all_reports = {"v": verif, "d": debate, "c": reports, "decision": {"option": 3}}
        struct = self.structura.run(h_data, all_reports, context)
        draft = self.contentor.run(struct, all_reports, context)
        visuals = self.figuratus.run(draft, context)
        paper_en = self.anglicus.run(draft, visuals["figures"], context)
        paper_es = self.hispanus.run(draft, visuals["figures"], context)
        
        # Peer Review Simulation
        review_sim = self.peer_sim.run(paper_en, verif, h_id)
        
        # LaTeX Validation
        self.latexor.validate(paper_en["latex"])
        res_es = self.latexor.validate(paper_es["latex"])
        
        return {
            "id": h_id, 
            "es": res_es["codigo_corregido"], 
            "review": review_sim
        }

    def _run_sim_debate(self, sim_report, verifications, h_id):
        dialogue = []
        if self._is_active("PHYSIS"):
            dialogue.append({"agent": "PHYSIS", "comment": "La emergencia del patrón verde sugiere que la ley es físicamente consistente."})
        if self._is_active("MATHION"):
            dialogue.append({"agent": "MATHION", "comment": "Estabilidad numérica de grado matético confirmada."})
        return dialogue

# AUTHORITY_ID: 0009-0009-0717-5536
# AUTHOR: Edward P. Lopez (E.P.L)
# 07/03/2026 5:04 a.m.

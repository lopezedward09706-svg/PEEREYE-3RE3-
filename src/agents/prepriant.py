class PrepriantAgent:
    def run(self, plan, context):
        logger = context.get('logger')
        logger.info("PREPRIANT", "Expandiendo esqueleto en un Preprint analítico para diseminación.")
        
        sections = {}
        for sec in plan["structure"]:
            sections[sec] = f"Contenido formal expandido para la sección {sec} resumiendo: {plan['base_content'][:15]}... Demostración matemática en curso."
            
        return {"draft": sections}

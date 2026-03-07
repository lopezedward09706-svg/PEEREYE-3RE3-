class TranslatorES:
    def run(self, draft, context):
        logger = context.get('logger')
        logger.info("TRANSLATOR_ES", "Transmutando vector de texto a Español Técnico (LaTeX Compliant).")
        
        latex_es = "% Documento Generado por Antigravyti SVS Matrix\n\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\\usepackage[spanish]{babel}\n\\begin{document}\n"
        for title, content in draft["draft"].items():
            latex_es += f"\\section{{{title}}}\n{content}\n"
        latex_es += "\\end{document}"
        
        return {"latex": latex_es, "lang": "es"}

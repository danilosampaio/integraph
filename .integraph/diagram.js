function getDiagram () { return `
architecture-beta
        group parsers[Parsers]
    group diagrams[Diagrams]
        service integraphcli(logos:terminal)[integraph CLI]
    service typescriptparser(logos:typescript-icon)[Typescript Parser] in parsers
    service architecturediagram(ix:diagram-module)[Architecture Diagram] in diagrams
    service mermaid(vscode-icons:file-type-mermaid)[mermaid]
    service javaparser[Java Parser] in parsers
    service treesitter(logos:treehouse-icon)[tree_sitter]
    service pythonparser[Python Parser] in parsers
    service rustparser[Rust Parser] in parsers
        integraphcli:L -[integraphcli__typescriptparser]- R:typescriptparser{group}
    integraphcli:R -[integraphcli__architecturediagram]- L:architecturediagram
    architecturediagram:B -[architecturediagram__mermaid]- T:mermaid
    javaparser:R -[javaparser__treesitter]- B:treesitter
    pythonparser:R -[pythonparser__treesitter]- B:treesitter
    rustparser:R -[rustparser__treesitter]- B:treesitter
    typescriptparser:L -[typescriptparser__treesitter]- B:treesitter` }
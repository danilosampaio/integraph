import { Sanitizer } from "../../IntegraphParser";

export default class RustSanitizer implements Sanitizer {
    sanitize(comment: string): string {
        const regex = /\/\/\/\s?(.*)/g;
        const matches = [...comment.matchAll(regex)];

        if (matches) {
            const yamlContent = matches
                .map(match => match[1])                       // Extrai o conteúdo de cada linha
                .filter(line => !line.includes('@integraph')) // Remove a linha com o @integraph
                .join('\n');                                  // Junta as linhas com quebras

            return yamlContent;
        }

        return comment;
    }
} 
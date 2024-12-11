import { Sanitizer } from "../../IntegraphParser";

export default class RustSanitizer implements Sanitizer {
    sanitize(comment: string): string {
        const regex = /\/\/\s?(.*)/g;
        const matches = [...comment.matchAll(regex)];

        if (matches) {
            const yamlContent = matches
                .map(match => match[1])
                .filter(line => !line.includes('@integraph'))
                .join('\n');
            return yamlContent;
        }

        return comment;
    }
} 
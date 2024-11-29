"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const IntegraphRunner_1 = __importDefault(require("../../src/IntegraphRunner"));
const TypescriptIntegraphParser_1 = __importDefault(require("../../src/parsers/typescript/TypescriptIntegraphParser"));
const architecture_1 = require("../../src/diagrams/architecture");
(0, globals_1.describe)('Integraph Runner', () => {
    const typescriptRunner = new IntegraphRunner_1.default(new TypescriptIntegraphParser_1.default());
    (0, globals_1.test)('typescript fixtures', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const pattern = 'src/diagrams/**/fixtures/*.{js,ts}';
        const integrations = [];
        try {
            for (var _d = true, _e = __asyncValues(typescriptRunner.scanFiles(pattern)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const entry = _c;
                integrations.push(...entry.integrations);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const architectureDiagram = new architecture_1.ArchitectureDiagram();
        const diagram = architectureDiagram.drawn(integrations);
        (0, globals_1.expect)(diagram).toEqual(`
architecture-beta
        group ecommerce[ECommerce]
        service recommendations(logos:aws-cloudsearch)[Recommendations] in ecommerce
        service catalog(database)[Catalog]
    service marketplace(internet)[Marketplace] in ecommerce
        service customerservice(server)[Customer Service]
        service paymentgateway(logos:paypal)[Payment gateway]
        recommendations:L -- R:catalog
    marketplace:R -- L:customerservice
    marketplace:B -- T:paymentgateway`);
    }));
});

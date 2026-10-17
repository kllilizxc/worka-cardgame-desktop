/** Shared, deterministic card-face layout. Artwork never contains rules or numbers. */
export declare const CARD_FACE_VERSION = 4;
export declare const CARD_FACE_THEMES: readonly [{
    readonly id: 'jade';
    readonly name: '青玉';
    readonly description: '青玉牌框 · 大幅插画';
    readonly version: 1;
}, {
    readonly id: 'scroll';
    readonly name: '宣纸';
    readonly description: '宣纸卷轴 · 题签与留白';
    readonly version: 1;
}];
export declare const CARD_KIND_LABELS: Record<string, string>;
export type CardFaceThemeId = typeof CARD_FACE_THEMES[number]['id'];
export interface FacePresentation {
    themeId: CardFaceThemeId;
    zoom: number;
    focus: number;
}
export declare const DEFAULT_FACE: FacePresentation;
export declare function normalizeFace(value?: Partial<FacePresentation>): FacePresentation;
export interface CardFaceDefinition {
    id?: string;
    name?: string;
    kind?: string;
    description?: string;
    effects?: Array<{
        text?: string;
    }>;
    race?: string;
    linggen?: string[];
    rarity?: string;
    attack?: number;
    health?: number;
}
export declare function cardRules(card: CardFaceDefinition): string;
export declare function faceDiagnostics(card: CardFaceDefinition): string[];
/** art is a bounded PNG data URL supplied by the asset service, never an arbitrary URL. */
export declare function renderCardFace(card: CardFaceDefinition, art: string, presentation: FacePresentation, includeStats?: boolean, fontFamily?: string): string;

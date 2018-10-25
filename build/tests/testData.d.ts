export declare const multiLocaleDataset: {
    meta: {
        mergeLanguages: boolean;
        langCode: undefined;
        keepLocale: boolean;
        locales: string[];
    };
    translations: {
        en_US: {
            CORE: {
                LABELS: {
                    YES: string;
                    NO: string;
                    SAVE: string;
                    CANCEL: string;
                };
            };
        };
        pl_PL: {
            CORE: {
                LABELS: {
                    YES: string;
                    NO: string;
                    SAVE: string;
                };
            };
        };
    };
    comments: {
        CORE: {
            LABELS: {
                YES: string;
                NO: string;
                SAVE: string;
            };
        };
    };
    tags: {
        tag1: {
            CORE: {
                LABELS: {
                    YES: null;
                };
            };
        };
        tag2: {
            CORE: {
                LABELS: {
                    NO: null;
                    SAVE: null;
                };
            };
        };
    };
    flatList: {
        multiLanguageMergedWithComments: {
            merged: ({
                name: string;
                text: string;
                comment: string;
            } | {
                name: string;
                text: string;
                comment?: undefined;
            })[];
        };
        multiLanguageMerged: {
            merged: {
                name: string;
                text: string;
            }[];
        };
        multiLanguageNonMergedWithComments: {
            lang: string;
            content: ({
                name: string;
                text: string;
                comment: string;
            } | {
                name: string;
                text: string;
                comment?: undefined;
            })[];
        }[];
        multiLanguageNonMerged: {
            lang: string;
            content: {
                name: string;
                text: string;
            }[];
        }[];
    };
    transformed: {
        yml: {
            mergedNoComments: {
                merged: string;
            };
            withComments: {
                lang: string;
                content: string;
            }[];
            noComments: {
                lang: string;
                content: string;
            }[];
        };
    };
};
export declare const singleLocaleDataset: {
    meta: {
        langCode: string;
        locales: string[];
    };
    translations: {
        CORE: {
            LABELS: {
                YES: string;
                NO: string;
                SAVE: string;
                CANCEL: string;
            };
        };
    };
    comments: {
        CORE: {
            LABELS: {
                YES: string;
                NO: string;
                SAVE: string;
            };
        };
    };
    transformed: {
        yml: {
            noComments: {
                lang: string;
                content: string;
            }[];
        };
    };
    flatList: {
        singleLanguage: {
            lang: string;
            content: {
                name: string;
                text: string;
            }[];
        }[];
        singleLanguageWithComments: {
            lang: string;
            content: ({
                name: string;
                text: string;
                comment: string;
            } | {
                name: string;
                text: string;
                comment?: undefined;
            })[];
        }[];
    };
};
export declare const minimalPassingObject: {
    translations: {
        en_US: {
            core: string;
            front: string;
            back: string;
        };
    };
    result: {
        en_US: {
            core: string;
            front: string;
            back: string;
        };
    };
    tags: {
        tag1: {
            core: null;
            front: null;
        };
        tag2: {
            front: null;
            back: null;
        };
    };
    meta: {
        locales: string[];
    };
};
export declare const spreadsheetData: {
    multiRawSpreadsheetData: string[][];
    multiRawSpreadsheetDataWithTags: string[][];
    multiTranslationsData: {
        en_US: {
            CORE: {
                LABELS: {
                    YES: string;
                    NO: string;
                    SAVE: string;
                    CANCEL: string;
                };
            };
            COMMON: {
                STH1: string;
                FORM: {
                    COMMENT: string;
                };
            };
            FRONT: {
                HEADER: {
                    TITLE: string;
                    CATCH_PHRASE: string;
                };
                PAGINATION: {
                    FIRST: string;
                    NEXT: string;
                    PREV: string;
                    LAST: string;
                };
            };
            BACK: {
                MAILS: {
                    REGISTER: {
                        SUBJECT: string;
                        GREETING: string;
                        LINE1: string;
                        FOOTER: string;
                    };
                };
            };
        };
        pl_PL: {
            CORE: {
                LABELS: {
                    YES: string;
                    NO: string;
                    SAVE: string;
                };
            };
            COMMON: {
                STH1: string;
                FORM: {
                    COMMENT: string;
                };
            };
            FRONT: {
                HEADER: {
                    TITLE: string;
                    CATCH_PHRASE: string;
                };
                PAGINATION: {
                    FIRST: string;
                    NEXT: string;
                    PREV: string;
                    LAST: string;
                };
            };
            BACK: {
                MAILS: {
                    REGISTER: {
                        SUBJECT: string;
                        GREETING: string;
                        LINE1: string;
                        FOOTER: string;
                    };
                };
            };
        };
    };
    result: {
        en_US: {
            CORE: {
                LABELS: {
                    YES: string;
                    NO: string;
                    SAVE: string;
                    CANCEL: string;
                };
            };
            COMMON: {
                STH1: string;
                FORM: {
                    COMMENT: string;
                };
            };
            FRONT: {
                HEADER: {
                    TITLE: string;
                    CATCH_PHRASE: string;
                };
                PAGINATION: {
                    FIRST: string;
                    NEXT: string;
                    PREV: string;
                    LAST: string;
                };
            };
            BACK: {
                MAILS: {
                    REGISTER: {
                        SUBJECT: string;
                        GREETING: string;
                        LINE1: string;
                        FOOTER: string;
                    };
                };
            };
        };
        pl_PL: {
            CORE: {
                LABELS: {
                    YES: string;
                    NO: string;
                    SAVE: string;
                };
            };
            COMMON: {
                STH1: string;
                FORM: {
                    COMMENT: string;
                };
            };
            FRONT: {
                HEADER: {
                    TITLE: string;
                    CATCH_PHRASE: string;
                };
                PAGINATION: {
                    FIRST: string;
                    NEXT: string;
                    PREV: string;
                    LAST: string;
                };
            };
            BACK: {
                MAILS: {
                    REGISTER: {
                        SUBJECT: string;
                        GREETING: string;
                        LINE1: string;
                        FOOTER: string;
                    };
                };
            };
        };
    };
    tags: {
        tag1: {
            COMMON: {
                STH1: null;
            };
            FRONT: {
                PAGINATION: {
                    FIRST: null;
                    NEXT: null;
                    PREV: null;
                    LAST: null;
                };
            };
        };
        tag2: {
            COMMON: {
                STH1: null;
            };
            FRONT: {
                PAGINATION: {
                    FIRST: null;
                    NEXT: null;
                };
            };
            BACK: {
                MAILS: {
                    REGISTER: {
                        FOOTER: null;
                    };
                };
            };
        };
    };
    comments: {
        CORE: {
            LABELS: {
                YES: string;
                NO: string;
                SAVE: string;
            };
        };
        FRONT: {
            HEADER: {
                TITLE: string;
                CATCH_PHRASE: string;
            };
        };
    };
    initialMeta: {
        mergeLanguages: undefined;
        langCode: undefined;
        keepLocale: undefined;
    };
    meta: {
        locales: string[];
    };
};

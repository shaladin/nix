export enum Pattern {
    Email = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    AlphaNumeric = '^[a-zA-Z0-9]+$',
    Site = '^(https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(\/[a-zA-Z0-9._%+-]*)*\/?$',
    Numeric = '^[0-9]+$'
}
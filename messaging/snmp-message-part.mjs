export default class SnmpMessagePart {
    constructor(type, length, value) {
        this.type = type;
        this.length = length;
        this.value = value;
        this.calculateBuffer();
    }

    calculateBuffer() {
        if(this.value === null || typeof this.value === 'undefined')
            this.asBuffer = Buffer.from([this.type, this.length]);
        else
            this.asBuffer = Buffer.concat(
                [Buffer.from([this.type, this.length]), this.value], this.value.length + 2)
    }

    get getValue() {
        return this.value;
    }

    /**
     * @param {(typeValue: number) => void} typeValue
     */
    set setType(typeValue) {
        this.type = typeValue;
        this.calculateBuffer();
    }
}

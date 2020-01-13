export default class SnmpMessagePart {
    constructor(type, length, value) {
        this.type = type;
        this.length = length;
        this.value = value;
        this.calculateBuffer();
    }

    calculateBuffer() {
        let lenArr = Array.isArray(this.length) ? this.length : 
            (Buffer.isBuffer(this.length) ? [...this.length] : [this.length]);

        if(this.value === null || typeof this.value === 'undefined')
            this.buffer = Buffer.from([...[this.type], ...lenArr])
        else
            this.buffer = Buffer.from([...[this.type], ...lenArr, ...this.value]);

        this.length = lenArr;
    }

    get getBuffer() {
        return this.buffer;
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
    
    /**
     * @param {(lenValue: number) => void} lenValue
     */
    set setLength(lenValue) {
        let calculateLength = (length) => {
            
            if (length < 0)
                throw new Error("length cannot be negative");

            let lengthArr = [];

            if (length < 127)
            {
                lengthArr.push(length);
                return lengthArr;
            }
            
            var c = new Array(16);
            var j = 0;
            while (length > 0)
            {
                c[j++] = length & 0xff;
                length = length >> 8;
            }
            
            lengthArr.push(0x80 | j);
            while (j > 0)
                lengthArr.push(c[--j]);

            return lengthArr;
        }

        this.length = Array.isArray(lenValue) ? lenValue :
            (Buffer.isBuffer(lenValue) ? [...lenValue] : calculateLength(lenValue))
            
        this.calculateBuffer();
    }

    get bufferLength() {
        return this.buffer.length;
    }

    get lengthValue() {
        return this.length;
    }
}

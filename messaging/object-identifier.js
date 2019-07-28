
class ObjectIdentifier {
    constructor(oid) {
        if(typeof(oid) === "string") {
            this.oidString = oid
            this.oidArray = this.ConvertToArray(this.oidString)
            this.encodedOid = this.Encode(this.oidArray)
        }
        else if(Array.isArray(oid))
        {
            this.encodedOid = oid
            this.oidArray = this.Decode(this.encodedOid)
            this.oidString = this.ConvertToString(this.oidArray)
        }
        else
            throw TypeError("Unexpected oid format!")
    }

    ConvertToArray(oidString) {
        return oidString.split('.').map(Number)
    }

    ConvertToString(oidArray) {
        return oidArray.join('.')
    }

    Encode(oidArray) {
        let encodedOidArray = [];
        let first = (40 * oidArray[0]) + oidArray[1];
        encodedOidArray.push(first);

        for(let i = 2; i < oidArray.length; i++) {
            encodedOidArray = encodedOidArray.concat(this.ConvertToByte(oidArray[i]))
        }

        return encodedOidArray
    }

    ConvertToByte(node) {
        let result = [ node & 0x7F ]
        while ((node = (node >> 7)) > 0) {
            result.push((node & 0x7F) | 0x80);
        }
        result.reverse()
        return result
    }

    Decode(encodedByteArray) {
        let result = [Math.round((encodedByteArray[0] / 40)), (encodedByteArray[0] % 40)]
        let buffer = 0;
            for (var i = 1; i < encodedByteArray.length; i++)
            {
                if ((encodedByteArray[i] & 0x80) == 0)
                {
                    result.push(encodedByteArray[i] + (buffer << 7));
                    buffer = 0;
                }
                else
                {
                    buffer <<= 7;
                    buffer += (encodedByteArray[i] & 0x7F);
                }
            }

            return result;
    }
}

exports.ObjectIdentifier = ObjectIdentifier

// let oid = new ObjectIdentifier('1.3.6.1.4.1.35483.1.1.1.3.1')
// console.log(oid.oidString)
// console.log(oid.oidArray)
// console.log(oid.encodedOid)
class Tag {
    constructor(configJson) {
        if(configJson !== undefined)
            this.ParseJsonFile(configJson)
    }

    ParseJsonFile(config) {
        this.name = config.name
        this.oid = config.oid
        this.currentValue = config.value
        this.valueMin = config.valueMin
        this.valueMax = config.valueMax
        this.multiplier = config.multiplier
        this.changeFactor = config.changeFactor
        this.alarmFactor = config.alarmFactor
        this.changeCount = 0
        this.alarmCount = 0

        if(this.currentValue === undefined)
            this.currentValue = this.GetReArrangedValue()
    }

    get isConstantValue() {
        return this.valueMax === undefined && this.valueMin === undefined
    }

    get value() {
         return this.isConstantValue ? this.currentValue : this.GetNextValue()
    }

    GetNextValue() {
        if(this.isConstantValue)
            return this.value

        ++this.changeCount
        
        let randValueBetweenLimits = Math.random() * (this.valueMax - this.valueMin) + this.valueMin
        let differenceRatio = 1 - (Math.min(this.currentValue, randValueBetweenLimits) / Math.max(this.currentValue, randValueBetweenLimits))
        differenceRatio = Math.min(differenceRatio, this.changeFactor) + this.alarmFactor
        let nextValue = this.currentValue + ((Math.random() > 0.5 ? 1 : -1) * (differenceRatio * this.currentValue))

        if(this.IsAlarmValue(nextValue) && !this.IsOkForAlarm())
            nextValue = this.GetReArrangedValue()
        else if((this.IsAlarmValue(nextValue) && this.IsOkForAlarm()))
            ++this.alarmCount

        return Math.floor(nextValue * this.multiplier)
    }

    // TestValue() {
    //     this.alarmCount = 0
    //     this.changeCount = 0
    //     let arr = []
    //     let testCount = 1000
    //     for (let index = 0; index < testCount; index++) {
    //         ++this.changeCount
    //         this.valueMin = 210
    //         this.value = 220
    //         this.valueMax = 230
    //         this.changeFactor = 0.005
    //         this.alarmFactor = 0.05
            
    //         let randValueBetweenLimits = Math.random() * (this.valueMax - this.valueMin) + this.valueMin
    //         let differenceRatio = 1 - (Math.min(this.value, randValueBetweenLimits) / Math.max(this.value, randValueBetweenLimits))
    //         differenceRatio = Math.min(differenceRatio, this.changeFactor) + this.alarmFactor
    //         let nextValue = this.value + ((Math.random() > 0.5 ? 1 : -1) * (differenceRatio * this.value))

    //         if(this.IsAlarmValue(nextValue) && !this.IsOkForAlarm()) {
    //             nextValue = this.GetReArrangedValue()
    //         }            
    //         else if((this.IsAlarmValue(nextValue) && this.IsOkForAlarm()))
    //         {
    //             ++this.alarmCount
    //         }

    //         arr.push(nextValue)
            
    //     }
    //     //console.log(arr.join(','))
    //     console.log("over max: " + arr.filter(x => x > this.valueMax).length)
    //     console.log("over min: " + arr.filter(x => x < this.valueMin).length)
    //     console.log("alarmcount: " + this.alarmCount)
    //     console.log(this.currentAlarmFactor)
        
    // }

    GetReArrangedValue() {
        return Math.random() * (this.valueMax - this.valueMin) + this.valueMin
    }

    IsAlarmValue(value) {
        return value > this.valueMax || value < this.valueMin
    }

    IsOkForAlarm() {
        return this.currentAlarmFactor < this.alarmFactor
    }

    get currentAlarmFactor() {
        return this.alarmCount / this.changeCount
    }
}

exports.Tag = Tag
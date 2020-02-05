export default class Tag {
  constructor(configJson) {
    if (configJson !== undefined) {
      this.ParseJsonFile(configJson);
    }
  }

  ParseJsonFile(config) {
    this.name = config.name;
    this.oid = config.oid;
    this.currentValue = config.value;
    this.valueMin = config.valueMin;
    this.valueMax = config.valueMax;
    this.multiplier = config.multiplier;
    this.changeFactor = config.changeFactor;
    this.alarmFactor = config.alarmFactor;
    this.changeCount = 0;
    this.alarmCount = 0;

    if (this.currentValue === undefined) {
      this.currentValue = this.GetReArrangedValue();
    }
  }

  get isConstantValue() {
    return this.valueMax === undefined && this.valueMin === undefined;
  }

  get value() {
    return this.isConstantValue ? this.currentValue : this.GetNextValue();
  }

  GetNextValue() {
    if (this.isConstantValue) {
      return this.value;
    }

    this.changeCount += 1;

    const differenceRatio = Math.random() * this.changeFactor;
    let nextValue = this.currentValue + ((Math.random() > 0.5 ? 1 : -1)
        * (differenceRatio * this.currentValue));

    if (this.IsOutOfRange(nextValue)) {
      nextValue = this.GetReArrangedValue();
    }

    if (this.IsAlarmValue(nextValue) && !this.IsOkForAlarm()) {
      nextValue = this.GetReArrangedValue();
    } else if ((this.IsAlarmValue(nextValue) && this.IsOkForAlarm())) {
      this.alarmCount += 1;
    }

    return Math.floor(nextValue * this.multiplier);
  }

  GetReArrangedValue() {
    return Math.random() * (this.valueMax - this.valueMin) + this.valueMin;
  }

  IsAlarmValue(value) {
    return value > this.valueMax || value < this.valueMin;
  }

  IsOkForAlarm() {
    return this.currentAlarmFactor < this.alarmFactor;
  }

  IsOutOfRange(value) {
    return (value < this.valueMin && this.valueMin >= 0);
  }

  get currentAlarmFactor() {
    return this.alarmCount / this.changeCount;
  }
}

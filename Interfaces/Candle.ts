// [date, o, h, l, c]
type Candle = [number, number, number, number, number];
type OHLC = [number, number, number, number];
type RawData = Candle[];
type CandleToNumberMapper = (candle: Candle) => number;
type Timestamp = number;

export {RawData, Candle, CandleToNumberMapper, OHLC, Timestamp}

// [
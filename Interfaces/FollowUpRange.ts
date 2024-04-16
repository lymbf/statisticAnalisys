type RangeMap = number[];
type DistanceMapOfFollowUpRange = RangeMap[];
type Reward = number;
type Risk = number;
type RR = [Risk, Reward];
type RangeDown = number;
type RangeUp = number;
type Timestamp = number;
type FollowupRange = [Timestamp, RangeDown, RangeUp]

export {RangeMap, DistanceMapOfFollowUpRange, Risk, Reward, RR, RangeUp, RangeDown, FollowupRange}
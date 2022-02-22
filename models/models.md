

[mongoose schematypes arrays](https://mongoosejs.com/docs/schematypes.html#arrays)
Note: specifying an empty array is equivalent to Mixed. The following all create arrays of Mixed:
```
const Empty1 = new Schema({ any: [] });
const Empty2 = new Schema({ any: Array });
const Empty3 = new Schema({ any: [Schema.Types.Mixed] });
const Empty4 = new Schema({ any: [{}] });
```

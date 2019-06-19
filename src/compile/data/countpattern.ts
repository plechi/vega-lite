import { duplicate, hash } from "../../util";
import { VgCountPatternTransform } from "../../vega.schema";
import { DataFlowNode } from "./dataflow";
import { CountPatternTransform } from "../../transform";

export class CountPatternTransformNode extends DataFlowNode {
  public clone() {
    return new CountPatternTransformNode(null, duplicate(this.countPattern));
  }

  constructor(parent: DataFlowNode, private countPattern: CountPatternTransform) {
    super(parent);
    this.countPattern = duplicate(countPattern);

    //don't know why we have to do this???
    this.countPattern=this.countPattern['countpattern'];
    this.countPattern.pattern = this.countPattern.pattern || "[\\w']+";
    this.countPattern.case = this.countPattern.case || 'lowercase';
    this.countPattern.stopwords = this.countPattern.stopwords || 'test';
    const specifiedAs = this.countPattern.as || [undefined, undefined];
    this.countPattern.as = [specifiedAs[0] || 'text', specifiedAs[1] || 'count'];
  }

  public producedFields() {
    return new Set(this.countPattern.as);
  }

  public dependentFields() {
    return new Set(this.countPattern.field);
  }

  public assemble(): VgCountPatternTransform {
    const {field, pattern, case: c, stopwords, as} = this.countPattern;

    return {
      type: 'countpattern',
      field: field,
      pattern: pattern,
      case: c,
      stopwords: stopwords,
      as: as
    };
  }

  public hash() {
    return `CountPatternTransform ${hash(this.countPattern)}`;
  }
}

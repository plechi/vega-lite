import {duplicate, hash} from '../../util';
import {VgProjectTransform} from '../../vega.schema';
import {DataFlowNode} from './dataflow';
import {ProjectTransform} from '../../transform';

export class ProjectTransformNode extends DataFlowNode {
  public clone() {
    return new ProjectTransformNode(null, duplicate(this.transform));
  }

  constructor(parent: DataFlowNode, private transform: ProjectTransform) {
    super(parent);
    this.transform = duplicate(transform);
    //don't know why we have to do this???
    //FIXME: add multiple ProjectTransformNodes to parent
    this.transform = this.transform['project'];
    if (Array.isArray(this.transform)) {
      this.transform = this.transform[0];
    }
    if (this.transform === undefined) {
      this.transform = {} as ProjectTransform;
    }
  }

  public producedFields() {
    return new Set(this.transform.as);
  }

  public dependentFields() {
    return new Set(this.transform.fields);
  }

  public assemble(): VgProjectTransform {
    const {fields, as} = this.transform;

    return {
      type: 'project',
      fields: fields,
      as: as
    };
  }

  public hash() {
    return `ProjectTransform ${hash(this.transform)}`;
  }
}

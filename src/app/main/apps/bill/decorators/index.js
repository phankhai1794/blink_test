import { CompositeDecorator } from "draft-js";
import { findEntities } from "../helpers/entity";
import Comment from "../components/Comment";

const decorator = ({ clickComment }) =>
  new CompositeDecorator([
    {
      strategy: (contentBlock, callback, contentState) => {
        return findEntities("COMMENT", contentBlock, callback, contentState);
      },
      component: Comment,
      props: { clickComment }
    }
  ]);

export default decorator;

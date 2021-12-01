import React from "react";
import styled from "styled-components";

const Comment = props => {
  const { clickComment, children } = props;

  return (
    <span onClick={clickComment}>
      <Stack className="fa-stack">
        <RevertIcon className="fa fa-comment fa-stack-2x" />
        <strong className="fa-stack-1x fa-stack-text fa-inverse">？</strong>
      </Stack>
      <Content>{children}</Content>
    </span>
  );
};

export default Comment;

const Content = styled.span`
  cursor: pointer;
  background-color: yellow;
`;

const Stack = styled.span`
  color: #ec5f67;
  font-size: 0.6rem;
  margin-top: -10px;
`;

const RevertIcon = styled.i`
  transform: rotateY(180deg);
`;

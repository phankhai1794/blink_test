import styled, { keyframes } from 'styled-components';

export const StyleResend = styled.a`
    text-decoration: underline !important;
    text-underline-offset: 2px;
    cursor: pointer;
`;

const process = keyframes`
    from { clip-path: polygon(0 0, 0 0, 0% 100%, 0 100%); }
    to { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
}`;

export const StyleResendEffect = styled.a`
    color: gray !important;
    text-decoration: underline !important;
    text-underline-offset: 2px;
    &:before {
        position: absolute;
        content: attr(content);
        color: rgb(45, 45, 45);
        text-decoration: underline;
        clip-path: polygon(0 0, 0 0, 0% 100%, 0 100%);
        animation-name: ${process};
        animation-duration: ${props => props.duration}s;
    }
`;
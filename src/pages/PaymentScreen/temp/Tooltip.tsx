import styled from "@emotion/styled";
import React, {type CSSProperties, type JSX} from "react";
import {usePopperTooltip} from "react-popper-tooltip";
import type {Config} from "react-popper-tooltip/dist/types";

interface IProps {
    content: string | JSX.Element;
    config?: Config;
    fixed?: boolean;
    containerStyles?: CSSProperties;
    children: React.ReactNode;
    style?: CSSProperties;
}

const Root = styled.div<{ fixed?: boolean }>`
    display: flex;
    background: white;
    max-width: 320px;
    min-width: 160px;
    z-index: 2;
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
    border-radius: 16px;
    box-shadow: 0px 8px 32px 0px rgba(0, 0, 0, 0.16);
    max-height: 240px;
    overflow: auto;
    &::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
`;
const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: fit-content;
`;
const Tooltip: React.FC<IProps> = ({
                                       containerStyles,
                                       children,
                                       content,
                                       config,
                                       style
                                   }) => {
    const {getTooltipProps, setTooltipRef, setTriggerRef, visible} =
        usePopperTooltip({...config});
    return (
        <Container style={style}>
            <div
                ref={setTriggerRef}
                style={{cursor: "pointer", ...containerStyles}}
            >
                {children}
            </div>
            {visible && (
                <Root ref={setTooltipRef} {...getTooltipProps()}>
                    {content}
                </Root>
            )}
        </Container>
    );
};
export default Tooltip;

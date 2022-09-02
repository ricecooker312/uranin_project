import React from "react";

const Group = ({
    className,
    space,
    children
}) => {
    if (space == 'full') {
        return (
            <>
                <div className={className}>{children}</div>
                <br />
            </>
        )
    } else {
        return <div className={className}>{children}</div>
    }
}

export default Group
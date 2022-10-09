import React from 'react'

const Item = ({
    className,
    space,
    children,
    style
}) => {
    if (space == 'full') {
        return (
            <>
                <div style={style} className={className}>{children}</div>
                <br />
            </>
        )
    } else {
        return (
            <div className={className}>{children}</div>
        )
    }
}

export default Item
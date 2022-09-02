import React from 'react'

const Item = ({
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
        return (
            <div className={className}>{children}</div>
        )
    }
}

export default Item
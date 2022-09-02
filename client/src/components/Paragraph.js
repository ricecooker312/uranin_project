import React from "react";

import './css/Paragraph.css'

const Paragraph = ({
    children,
    center,
    className
}) => {
    if (center) {
        return <p className={`center ${className}`}>{children}</p>
    } else {
        return <p className={className}>{children}</p>
    }
}

export default Paragraph
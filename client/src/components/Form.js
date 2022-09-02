import React from "react";

const Form = ({
    method,
    action,
    children
}) => {
    return <form method={method} action={action}>{children}</form>
}

export default Form
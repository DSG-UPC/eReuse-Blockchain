// import Link from "next/link"

const ErrorPage = (props: { message?: string }) => <div id="global-message">
    <div className="card">
        <div>{props && props.message || "Error"}</div>
    </div>
</div>

export default ErrorPage

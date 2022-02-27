export default function Header(){
    return (
        <div>
            <h1>Auto-Refresher</h1>
            <div>
                Part of <a href='/dc/tools'>Chazza's DC Tools</a>
            </div>
            <div>v{process.env.REACT_APP_VERSION} &copy; eden chazard</div>
        </div>
    );
}
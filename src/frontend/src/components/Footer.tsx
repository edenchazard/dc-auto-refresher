export default function Footer(){
    return (
        <div className='pt-2'>
            <h1>FART</h1>
            <div>
                Part of <a
                    className='underline'
                    href='/dc/tools'>Chazza's DC Tools</a>
            </div>
            <div>v{process.env.REACT_APP_VERSION} &copy; eden chazard</div>
        </div>
    );
}
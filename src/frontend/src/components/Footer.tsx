export default function Footer(){
    return (
        <div className='p-2 mt-2 text-white text-center'>
            <header>
                FART
            </header>
            <footer>
                <div>
                    Part of <a
                        className='underline'
                        href='/dc/tools'>Chazza's DC Tools</a>
                </div>
                <div>v{process.env.REACT_APP_VERSION} &copy; eden chazard</div>
            </footer>
        </div>
    );
}
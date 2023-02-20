import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { faMugHot } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <div className="p-2 mt-2 text-white text-center">
      <footer>
        <div className="flex flex-row justify-center items-center text-slate-100">
          <a
            className="mx-2"
            href="https://github.com/edenchazard/dc-auto-refresher/"
            title="Github"
          >
            <FontAwesomeIcon
              size="2x"
              icon={faGithub as IconProp}
            />
          </a>
          <a
            className="mx-2"
            href="https://ko-fi.com/dctools"
            title="Buy me a ko-fi"
          >
            <FontAwesomeIcon
              size="2x"
              icon={faMugHot as IconProp}
            />
          </a>
        </div>
        <div className="m-2">
          <div>
            <span>FART</span>
            <br />
            Part of{' '}
            <a
              className="underline"
              href="/dc/tools"
            >
              Chazza's DC Tools
            </a>
          </div>
          <div>v{import.meta.env.VITE_APP_VERSION} &copy; eden chazard</div>
        </div>
      </footer>
    </div>
  );
}

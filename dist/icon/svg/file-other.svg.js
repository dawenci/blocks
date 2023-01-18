import { getRegisteredSvgIcon, registerSvgIcon } from '../store.js';
const data = `<svg t="1615304471141" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1610" width="200" height="200"><path d="M656.5625 126.125l184.5 185.625 8.4375 20.25v545.625l-28.125 28.125h-618.75l-28.125-28.125v-731.25l28.125-28.125h434.25l19.6875 7.875zM624.5 343.25h168.75l-168.75-168.75v168.75zM230.75 174.5v675h562.5V399.5H596.375L568.25 371.375V174.5H230.75z m450 281.25H343.25v56.25h337.5V455.75zM343.25 568.25h337.5v56.25H343.25V568.25z m337.5 112.5H343.25v56.25h337.5v-56.25z" p-id="1611"></path></svg>`;
registerSvgIcon('file-other', data);
export default getRegisteredSvgIcon('file-other');

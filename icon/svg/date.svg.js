import { getRegisteredSvgIcon, registerSvgIcon } from '../store.js'

const data =
`<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<path d="M805.49888 981.49888l-602.3168-0.76288c-86.59456-8.192-154.56768-81.3056-154.56768-170.01472L48.6144 291.73248c0-94.1568 76.60032-170.75712 170.7776-170.75712l586.10176 0c94.1568 0 170.73152 76.60032 170.73152 170.75712L976.22528 810.7008C976.2304 904.87296 899.63008 981.49888 805.49888 981.49888L805.49888 981.49888zM219.3664 190.57152c-55.79776 0-101.20192 45.38368-101.20192 101.18144l0 518.96832c0 55.79776 45.40416 101.20704 101.20192 101.20704l586.13248 0c55.77728 0 101.16096-45.40928 101.16096-101.20704L906.65984 291.73248c0-55.79776-45.38368-101.18656-101.16096-101.18656L219.3664 190.54592 219.3664 190.57152zM698.84416 290.51904c-25.60512 0-46.38208-20.77696-46.38208-46.38208l0-158.6688c0-25.6 20.77696-46.38208 46.38208-46.38208 25.6 0 46.38208 20.78208 46.38208 46.38208L745.22624 244.1216C745.22624 269.7472 724.46976 290.51904 698.84416 290.51904L698.84416 290.51904zM315.65824 290.51904c-25.60512 0-46.38208-20.77696-46.38208-46.38208l0-158.6688c0-25.6 20.77696-46.38208 46.38208-46.38208 25.6 0 46.38208 20.78208 46.38208 46.38208L362.04032 244.1216C362.04032 269.7472 341.28896 290.51904 315.65824 290.51904L315.65824 290.51904zM534.8864 794.78784l-44.27264 0c-25.6 0-46.38208-20.77696-46.38208-46.38208 0-25.6 20.78208-46.38208 46.38208-46.38208l44.27264 0c25.6 0 46.38208 20.78208 46.38208 46.38208C581.26848 774.01088 560.4864 794.78784 534.8864 794.78784L534.8864 794.78784zM930.79552 452.608 121.24672 452.608c-25.60512 0-46.38208-20.78208-46.38208-46.38208 0-25.60512 20.77696-46.38208 46.38208-46.38208l809.5744 0c25.6 0 46.38208 20.77696 46.38208 46.38208C977.2032 431.82592 956.42624 452.608 930.79552 452.608L930.79552 452.608zM327.92576 649.03168l-44.27264 0c-25.6 0-46.38208-20.78208-46.38208-46.38208 0-25.60512 20.78208-46.38208 46.38208-46.38208l44.27264 0c25.6 0 46.38208 20.77696 46.38208 46.38208C374.30784 628.25472 353.52576 649.03168 327.92576 649.03168L327.92576 649.03168zM534.8864 649.03168l-44.27264 0c-25.6 0-46.38208-20.78208-46.38208-46.38208 0-25.60512 20.78208-46.38208 46.38208-46.38208l44.27264 0c25.6 0 46.38208 20.77696 46.38208 46.38208S560.4864 649.03168 534.8864 649.03168L534.8864 649.03168zM741.27872 649.03168l-44.26752 0c-25.60512 0-46.38208-20.78208-46.38208-46.38208 0-25.60512 20.77696-46.38208 46.38208-46.38208l44.26752 0c25.60512 0 46.38208 20.77696 46.38208 46.38208C787.6608 628.25472 766.90944 649.03168 741.27872 649.03168L741.27872 649.03168zM327.92576 794.78784l-44.27264 0c-25.6 0-46.38208-20.77696-46.38208-46.38208 0-25.6 20.78208-46.38208 46.38208-46.38208l44.27264 0c25.6 0 46.38208 20.78208 46.38208 46.38208C374.30784 774.01088 353.52576 794.78784 327.92576 794.78784L327.92576 794.78784zM741.27872 794.78784l-44.26752 0c-25.60512 0-46.38208-20.77696-46.38208-46.38208 0-25.6 20.77696-46.38208 46.38208-46.38208l44.26752 0c25.60512 0 46.38208 20.78208 46.38208 46.38208C787.6608 774.01088 766.90944 794.78784 741.27872 794.78784L741.27872 794.78784z"></path>
</svg>`

registerSvgIcon('date', data)

export default getRegisteredSvgIcon('date')

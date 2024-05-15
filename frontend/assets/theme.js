import type {CustomThemeConfig} from '@skeletonlabs/tw-plugin';

export const myTheme: CustomThemeConfig = {
    name: 'skeleton-theme',
    properties: {
        // =~= Theme Properties =~=
        "--theme-font-family-base": `system-ui`,
        "--theme-font-family-heading": `system-ui`,
        "--theme-font-color-base": "0 0 0",
        "--theme-font-color-dark": "255 255 255",
        "--theme-rounded-base": "9999px",
        "--theme-rounded-container": "8px",
        "--theme-border-base": "1px",
        // =~= Theme On-X Colors =~=
        "--on-primary": "0 0 0",
        "--on-secondary": "0 0 0",
        "--on-tertiary": "255 255 255",
        "--on-success": "0 0 0",
        "--on-warning": "0 0 0",
        "--on-error": "0 0 0",
        "--on-surface": "255 255 255",
        // =~= Theme Colors  =~=
        // primary | #ee048d
        "--color-primary-50": "252 217 238", // #fcd9ee
        "--color-primary-100": "252 205 232", // #fccde8
        "--color-primary-200": "251 192 227", // #fbc0e3
        "--color-primary-300": "248 155 209", // #f89bd1
        "--color-primary-400": "243 79 175", // #f34faf
        "--color-primary-500": "238 4 141", // #ee048d
        "--color-primary-600": "214 4 127", // #d6047f
        "--color-primary-700": "179 3 106", // #b3036a
        "--color-primary-800": "143 2 85", // #8f0255
        "--color-primary-900": "117 2 69", // #750245
        // secondary | #a3eb23
        "--color-secondary-50": "241 252 222", // #f1fcde
        "--color-secondary-100": "237 251 211", // #edfbd3
        "--color-secondary-200": "232 250 200", // #e8fac8
        "--color-secondary-300": "218 247 167", // #daf7a7
        "--color-secondary-400": "191 241 101", // #bff165
        "--color-secondary-500": "163 235 35", // #a3eb23
        "--color-secondary-600": "147 212 32", // #93d420
        "--color-secondary-700": "122 176 26", // #7ab01a
        "--color-secondary-800": "98 141 21", // #628d15
        "--color-secondary-900": "80 115 17", // #507311
        // tertiary | #004575
        "--color-tertiary-50": "217 227 234", // #d9e3ea
        "--color-tertiary-100": "204 218 227", // #ccdae3
        "--color-tertiary-200": "191 209 221", // #bfd1dd
        "--color-tertiary-300": "153 181 200", // #99b5c8
        "--color-tertiary-400": "77 125 158", // #4d7d9e
        "--color-tertiary-500": "0 69 117", // #004575
        "--color-tertiary-600": "0 62 105", // #003e69
        "--color-tertiary-700": "0 52 88", // #003458
        "--color-tertiary-800": "0 41 70", // #002946
        "--color-tertiary-900": "0 34 57", // #002239
        // success | #3bbbf7
        "--color-success-50": "226 245 254", // #e2f5fe
        "--color-success-100": "216 241 253", // #d8f1fd
        "--color-success-200": "206 238 253", // #ceeefd
        "--color-success-300": "177 228 252", // #b1e4fc
        "--color-success-400": "118 207 249", // #76cff9
        "--color-success-500": "59 187 247", // #3bbbf7
        "--color-success-600": "53 168 222", // #35a8de
        "--color-success-700": "44 140 185", // #2c8cb9
        "--color-success-800": "35 112 148", // #237094
        "--color-success-900": "29 92 121", // #1d5c79
        // warning | #ed04b4
        "--color-warning-50": "252 217 244", // #fcd9f4
        "--color-warning-100": "251 205 240", // #fbcdf0
        "--color-warning-200": "251 192 236", // #fbc0ec
        "--color-warning-300": "248 155 225", // #f89be1
        "--color-warning-400": "242 79 203", // #f24fcb
        "--color-warning-500": "237 4 180", // #ed04b4
        "--color-warning-600": "213 4 162", // #d504a2
        "--color-warning-700": "178 3 135", // #b20387
        "--color-warning-800": "142 2 108", // #8e026c
        "--color-warning-900": "116 2 88", // #740258
        // error | #d6ea8a
        "--color-error-50": "249 252 237", // #f9fced
        "--color-error-100": "247 251 232", // #f7fbe8
        "--color-error-200": "245 250 226", // #f5fae2
        "--color-error-300": "239 247 208", // #eff7d0
        "--color-error-400": "226 240 173", // #e2f0ad
        "--color-error-500": "214 234 138", // #d6ea8a
        "--color-error-600": "193 211 124", // #c1d37c
        "--color-error-700": "161 176 104", // #a1b068
        "--color-error-800": "128 140 83", // #808c53
        "--color-error-900": "105 115 68", // #697344
        // surface | #0d597c
        "--color-surface-50": "219 230 235", // #dbe6eb
        "--color-surface-100": "207 222 229", // #cfdee5
        "--color-surface-200": "195 214 222", // #c3d6de
        "--color-surface-300": "158 189 203", // #9ebdcb
        "--color-surface-400": "86 139 163", // #568ba3
        "--color-surface-500": "13 89 124", // #0d597c
        "--color-surface-600": "12 80 112", // #0c5070
        "--color-surface-700": "10 67 93", // #0a435d
        "--color-surface-800": "8 53 74", // #08354a
        "--color-surface-900": "6 44 61", // #062c3d

    }
}

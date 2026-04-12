# Changelog

## [0.1.23](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.22...v0.1.23) (2026-04-12)


### Bug Fixes

* add alias for server auth virtual module to resolve types in Nitro tsconfig ([#73](https://github.com/genu/nuxt-better-auth-utils/issues/73)) ([e062dd8](https://github.com/genu/nuxt-better-auth-utils/commit/e062dd80e62989e516f5b6bf4d7fa53b97e59c1a)), closes [#71](https://github.com/genu/nuxt-better-auth-utils/issues/71)

## [0.1.22](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.21...v0.1.22) (2026-04-12)


### Bug Fixes

* rename config alias to avoid Nitro auto-import type collision ([#69](https://github.com/genu/nuxt-better-auth-utils/issues/69)) ([c327241](https://github.com/genu/nuxt-better-auth-utils/commit/c327241839c84342e3526c4e785b40837adabb9a)), closes [#68](https://github.com/genu/nuxt-better-auth-utils/issues/68)

## [0.1.21](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.20...v0.1.21) (2026-04-12)


### Bug Fixes

* use $Infer.Session for server auth types to avoid depth limit ([#66](https://github.com/genu/nuxt-better-auth-utils/issues/66)) ([601557f](https://github.com/genu/nuxt-better-auth-utils/commit/601557f76ef27d833aef437afc98f110c85cd717))

## [0.1.20](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.19...v0.1.20) (2026-04-12)


### Bug Fixes

* infer server auth types from user config ([#62](https://github.com/genu/nuxt-better-auth-utils/issues/62)) ([1ca08ce](https://github.com/genu/nuxt-better-auth-utils/commit/1ca08cef0ab540f3447519967de63d51f3de848c))

## [0.1.19](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.18...v0.1.19) (2026-04-09)


### Bug Fixes

* deduplicate concurrent fetch calls in useAuth ([#58](https://github.com/genu/nuxt-better-auth-utils/issues/58)) ([2bf3195](https://github.com/genu/nuxt-better-auth-utils/commit/2bf3195be27f495219857aa5ffc33a8dc07ea2ce))

## [0.1.18](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.17...v0.1.18) (2026-04-09)


### Bug Fixes

* use $fetch for SSR session hydration to avoid HTTP round-trip ([#56](https://github.com/genu/nuxt-better-auth-utils/issues/56)) ([82f43f4](https://github.com/genu/nuxt-better-auth-utils/commit/82f43f4c2b3932d9085b93679a9ff8b290b4f123)), closes [#55](https://github.com/genu/nuxt-better-auth-utils/issues/55)

## [0.1.17](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.16...v0.1.17) (2026-04-08)


### Bug Fixes

* restore session on pages with ssr: false route rules ([#51](https://github.com/genu/nuxt-better-auth-utils/issues/51)) ([d91d4ff](https://github.com/genu/nuxt-better-auth-utils/commit/d91d4ff964131255306d98d1f9e139676831aee2))

## [0.1.16](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.15...v0.1.16) (2026-04-08)


### Bug Fixes

* preserve plugin and custom session types in useAuth composable ([#46](https://github.com/genu/nuxt-better-auth-utils/issues/46)) ([64fe0ca](https://github.com/genu/nuxt-better-auth-utils/commit/64fe0ca6ec17e3d7069e1ed0341ca64a735f5223)), closes [#45](https://github.com/genu/nuxt-better-auth-utils/issues/45)

## [0.1.15](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.14...v0.1.15) (2026-04-08)


### Features

* add AuthOnly and GuestOnly components with ready state ([#11](https://github.com/genu/nuxt-better-auth-utils/issues/11)) ([d24e82c](https://github.com/genu/nuxt-better-auth-utils/commit/d24e82ca9e1144ce48f97b40d059c83e9390df49))
* add AuthUserButton and AuthTeamSwitcher renderless components ([#24](https://github.com/genu/nuxt-better-auth-utils/issues/24)) ([b7e83ae](https://github.com/genu/nuxt-better-auth-utils/commit/b7e83ae7b5b2ad3eb34e1078d8e69e6689f45da5))


### Bug Fixes

* add explicit imports for useRuntimeConfig and createError in generated server auth ([#30](https://github.com/genu/nuxt-better-auth-utils/issues/30)) ([b7d5b1f](https://github.com/genu/nuxt-better-auth-utils/commit/b7d5b1fb45a7874a06c29e21660c1d4bd5e50228)), closes [#29](https://github.com/genu/nuxt-better-auth-utils/issues/29)
* add explicit imports to runtime files ([#22](https://github.com/genu/nuxt-better-auth-utils/issues/22)) ([4245df9](https://github.com/genu/nuxt-better-auth-utils/commit/4245df94277b2d4c3cf1914ffe1879c1dc8ed2b8))
* add explicit type to signal param in generated useAuth ([#42](https://github.com/genu/nuxt-better-auth-utils/issues/42)) ([aaf0c29](https://github.com/genu/nuxt-better-auth-utils/commit/aaf0c29806f7c1b052d6045ac902e7d3ce4fff81)), closes [#40](https://github.com/genu/nuxt-better-auth-utils/issues/40)
* add repository url to package.json for npm provenance verification ([#7](https://github.com/genu/nuxt-better-auth-utils/issues/7)) ([fb47965](https://github.com/genu/nuxt-better-auth-utils/commit/fb47965da763a6b6b2ed4e786e8c17c0f49f9d56))
* **ci:** update prepare-release workflow for PR-based flow ([#35](https://github.com/genu/nuxt-better-auth-utils/issues/35)) ([ad1f5a2](https://github.com/genu/nuxt-better-auth-utils/commit/ad1f5a2b010d821416aa7fdd13c604ea804fde0a))
* **deps:** update dependencies ([e0b7064](https://github.com/genu/nuxt-better-auth-utils/commit/e0b70640d810f9f9e8fd1a5536a321510ff9d127))
* **deps:** update dependencies ([48a7b07](https://github.com/genu/nuxt-better-auth-utils/commit/48a7b079939175cb6c6f2fa0d15856897a3408cf))
* generate #better-auth-utils types into .nuxt/ for typecheck resolution ([#19](https://github.com/genu/nuxt-better-auth-utils/issues/19)) ([176d50c](https://github.com/genu/nuxt-better-auth-utils/commit/176d50c6eb336a40b47a771099b8938cf1b1f373)), closes [#16](https://github.com/genu/nuxt-better-auth-utils/issues/16)
* include types.ts as build entry so #better-auth-utils alias works ([#14](https://github.com/genu/nuxt-better-auth-utils/issues/14)) ([d629a6d](https://github.com/genu/nuxt-better-auth-utils/commit/d629a6d401523dba78c985af7ffadc680575a77e)), closes [#13](https://github.com/genu/nuxt-better-auth-utils/issues/13)
* move config files to scoped directories for tsconfig resolution ([#32](https://github.com/genu/nuxt-better-auth-utils/issues/32)) ([6c55da8](https://github.com/genu/nuxt-better-auth-utils/commit/6c55da806124073f71e5f840a61dbcfb831a0e05))
* move config files to scoped directories for tsconfig resolution ([#32](https://github.com/genu/nuxt-better-auth-utils/issues/32)) ([320e9b6](https://github.com/genu/nuxt-better-auth-utils/commit/320e9b62c488580a54498092a1fc45835c3a9196))
* prevent auth plugin crash during prerender ([#39](https://github.com/genu/nuxt-better-auth-utils/issues/39)) ([2766bb4](https://github.com/genu/nuxt-better-auth-utils/commit/2766bb43fe6f3c42a9e783edb9b9b05291b35d7a)), closes [#38](https://github.com/genu/nuxt-better-auth-utils/issues/38)
* remove .ts extension from addPlugin path for consistency ([#9](https://github.com/genu/nuxt-better-auth-utils/issues/9)) ([43df986](https://github.com/genu/nuxt-better-auth-utils/commit/43df986b75c239d2a2080dcee29fa5824c72d3cd))
* resolve vue-tsc failure for AuthInstance type in useAuth composable ([#44](https://github.com/genu/nuxt-better-auth-utils/issues/44)) ([318346d](https://github.com/genu/nuxt-better-auth-utils/commit/318346dee8f5165e928cec6a08068787a190c08f)), closes [#41](https://github.com/genu/nuxt-better-auth-utils/issues/41)
* use addServerTemplate for Nitro-compatible server auth generation ([#27](https://github.com/genu/nuxt-better-auth-utils/issues/27)) ([09d379d](https://github.com/genu/nuxt-better-auth-utils/commit/09d379df21ccb473414561906ce74524e99ee742)), closes [#26](https://github.com/genu/nuxt-better-auth-utils/issues/26)
* use addTypeTemplate for #better-auth-utils typecheck resolution ([#17](https://github.com/genu/nuxt-better-auth-utils/issues/17)) ([5b95855](https://github.com/genu/nuxt-better-auth-utils/commit/5b958558e1f92d5bbf93bd7de4a3dec7eec64432)), closes [#16](https://github.com/genu/nuxt-better-auth-utils/issues/16)

## [0.1.14](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.13...v0.1.14) (2026-04-04)


### Bug Fixes

* add explicit type to signal param in generated useAuth ([#42](https://github.com/genu/nuxt-better-auth-utils/issues/42)) ([6f3d67d](https://github.com/genu/nuxt-better-auth-utils/commit/6f3d67db53abae455f1865b2d269343b5c42816a)), closes [#40](https://github.com/genu/nuxt-better-auth-utils/issues/40)
* resolve vue-tsc failure for AuthInstance type in useAuth composable ([#44](https://github.com/genu/nuxt-better-auth-utils/issues/44)) ([e4df180](https://github.com/genu/nuxt-better-auth-utils/commit/e4df18076aed6b3ea2c8c99c68ac09f07e9e082d)), closes [#41](https://github.com/genu/nuxt-better-auth-utils/issues/41)

## [0.1.13](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.12...v0.1.13) (2026-04-04)


### Bug Fixes

* **ci:** update prepare-release workflow for PR-based flow ([#35](https://github.com/genu/nuxt-better-auth-utils/issues/35)) ([a3fcc0e](https://github.com/genu/nuxt-better-auth-utils/commit/a3fcc0e7fe81b6153c72a59cf6119a8af426353d))
* prevent auth plugin crash during prerender ([#39](https://github.com/genu/nuxt-better-auth-utils/issues/39)) ([82b71df](https://github.com/genu/nuxt-better-auth-utils/commit/82b71dfeaa081069a780cacaf933a383e45680d5)), closes [#38](https://github.com/genu/nuxt-better-auth-utils/issues/38)

## [0.1.12](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.11...v0.1.12) (2026-03-24)


### Bug Fixes

* move config files to scoped directories for tsconfig resolution ([#32](https://github.com/genu/nuxt-better-auth-utils/issues/32)) ([a9626a3](https://github.com/genu/nuxt-better-auth-utils/commit/a9626a3d63e04b61bd7566ae9dc749d1e4a72b0b))
* move config files to scoped directories for tsconfig resolution ([#32](https://github.com/genu/nuxt-better-auth-utils/issues/32)) ([9235340](https://github.com/genu/nuxt-better-auth-utils/commit/92353406015adef510c3996a9d4e918d6f87b790))

## [0.1.11](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.10...v0.1.11) (2026-03-24)


### Bug Fixes

* add explicit imports for useRuntimeConfig and createError in generated server auth ([#30](https://github.com/genu/nuxt-better-auth-utils/issues/30)) ([b821e22](https://github.com/genu/nuxt-better-auth-utils/commit/b821e22963e07c5982a285e153e96b978a054e82)), closes [#29](https://github.com/genu/nuxt-better-auth-utils/issues/29)

## [0.1.10](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.9...v0.1.10) (2026-03-24)


### Bug Fixes

* use addServerTemplate for Nitro-compatible server auth generation ([#27](https://github.com/genu/nuxt-better-auth-utils/issues/27)) ([1a2650b](https://github.com/genu/nuxt-better-auth-utils/commit/1a2650b1c85e73fa306b55242ceda895eacf55d7)), closes [#26](https://github.com/genu/nuxt-better-auth-utils/issues/26)

## [0.1.9](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.8...v0.1.9) (2026-03-24)


### Features

* add AuthUserButton and AuthTeamSwitcher renderless components ([#24](https://github.com/genu/nuxt-better-auth-utils/issues/24)) ([13c3134](https://github.com/genu/nuxt-better-auth-utils/commit/13c313477d2aed0e95cdeeca599497a1d68c2afa))

## [0.1.8](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.7...v0.1.8) (2026-03-23)


### Bug Fixes

* add explicit imports to runtime files ([#22](https://github.com/genu/nuxt-better-auth-utils/issues/22)) ([5e91b37](https://github.com/genu/nuxt-better-auth-utils/commit/5e91b373b9018645ade4432a38c3d50e10360deb))

## [0.1.7](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.6...v0.1.7) (2026-03-23)


### Bug Fixes

* generate #better-auth-utils types into .nuxt/ for typecheck resolution ([#19](https://github.com/genu/nuxt-better-auth-utils/issues/19)) ([7be0b80](https://github.com/genu/nuxt-better-auth-utils/commit/7be0b80519fcf26bf6a8b526ab1ece7a21a8027a)), closes [#16](https://github.com/genu/nuxt-better-auth-utils/issues/16)

## [0.1.6](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.5...v0.1.6) (2026-03-23)


### Bug Fixes

* use addTypeTemplate for #better-auth-utils typecheck resolution ([#17](https://github.com/genu/nuxt-better-auth-utils/issues/17)) ([c09f06f](https://github.com/genu/nuxt-better-auth-utils/commit/c09f06f34580a1f14d3aad1818def5651666c80b)), closes [#16](https://github.com/genu/nuxt-better-auth-utils/issues/16)

## [0.1.5](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.4...v0.1.5) (2026-03-23)


### Bug Fixes

* include types.ts as build entry so #better-auth-utils alias works ([#14](https://github.com/genu/nuxt-better-auth-utils/issues/14)) ([1c139e0](https://github.com/genu/nuxt-better-auth-utils/commit/1c139e0d368bc87d47673ad6c4c07b511646102a)), closes [#13](https://github.com/genu/nuxt-better-auth-utils/issues/13)

## [0.1.4](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.3...v0.1.4) (2026-03-20)


### Features

* add AuthOnly and GuestOnly components with ready state ([#11](https://github.com/genu/nuxt-better-auth-utils/issues/11)) ([d38d4e8](https://github.com/genu/nuxt-better-auth-utils/commit/d38d4e893b02817bbf3e764c1ef03d0cadbc3eeb))

## [0.1.3](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.2...v0.1.3) (2026-03-20)


### Bug Fixes

* remove .ts extension from addPlugin path for consistency ([#9](https://github.com/genu/nuxt-better-auth-utils/issues/9)) ([827d912](https://github.com/genu/nuxt-better-auth-utils/commit/827d91295c1c9e73a530ff21a90043455c5adde2))

## [0.1.2](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.1...v0.1.2) (2026-03-20)


### Bug Fixes

* add repository url to package.json for npm provenance verification ([#7](https://github.com/genu/nuxt-better-auth-utils/issues/7)) ([27532ad](https://github.com/genu/nuxt-better-auth-utils/commit/27532ad04d8841efd0f14e7ee7c9fa2b3b229b7b))

## [0.1.1](https://github.com/genu/nuxt-better-auth-utils/compare/v0.1.0...v0.1.1) (2026-03-20)


### Bug Fixes

* **deps:** update dependencies ([795f741](https://github.com/genu/nuxt-better-auth-utils/commit/795f741daebdfb0f5b2f9b0ebd443c74fefbcba6))
* **deps:** update dependencies ([636768d](https://github.com/genu/nuxt-better-auth-utils/commit/636768d79fa4ffc44283a0fc4250fffe84178099))

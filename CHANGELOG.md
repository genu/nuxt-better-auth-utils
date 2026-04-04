# Changelog

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

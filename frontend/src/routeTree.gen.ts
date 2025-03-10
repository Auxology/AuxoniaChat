/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as ChatIndexImport } from './routes/chat/index'
import { Route as SignUpVerifyImport } from './routes/sign-up/verify'
import { Route as SignUpFinishImport } from './routes/sign-up/finish'
import { Route as SecurityTermsImport } from './routes/security/terms'
import { Route as SecurityPrivacyImport } from './routes/security/privacy'
import { Route as SecurityCookiesImport } from './routes/security/cookies'
import { Route as RecoverAccountVerifyImport } from './routes/recover-account/verify'
import { Route as RecoverAccountNewEmailImport } from './routes/recover-account/new-email'
import { Route as RecoverAccountFinishImport } from './routes/recover-account/finish'
import { Route as ForgotPasswordVerifyImport } from './routes/forgot-password/verify'
import { Route as ForgotPasswordFinishImport } from './routes/forgot-password/finish'
import { Route as Errors429Import } from './routes/errors/429'

// Create Virtual Routes

const SignUpIndexLazyImport = createFileRoute('/sign-up/')()
const SecurityIndexLazyImport = createFileRoute('/security/')()
const RecoverAccountIndexLazyImport = createFileRoute('/recover-account/')()
const LoginIndexLazyImport = createFileRoute('/login/')()
const HelpIndexLazyImport = createFileRoute('/help/')()
const ForgotPasswordIndexLazyImport = createFileRoute('/forgot-password/')()
const ContactIndexLazyImport = createFileRoute('/contact/')()
const AboutIndexLazyImport = createFileRoute('/about/')()

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const SignUpIndexLazyRoute = SignUpIndexLazyImport.update({
  id: '/sign-up/',
  path: '/sign-up/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/sign-up/index.lazy').then((d) => d.Route))

const SecurityIndexLazyRoute = SecurityIndexLazyImport.update({
  id: '/security/',
  path: '/security/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/security/index.lazy').then((d) => d.Route),
)

const RecoverAccountIndexLazyRoute = RecoverAccountIndexLazyImport.update({
  id: '/recover-account/',
  path: '/recover-account/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/recover-account/index.lazy').then((d) => d.Route),
)

const LoginIndexLazyRoute = LoginIndexLazyImport.update({
  id: '/login/',
  path: '/login/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/login/index.lazy').then((d) => d.Route))

const HelpIndexLazyRoute = HelpIndexLazyImport.update({
  id: '/help/',
  path: '/help/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/help/index.lazy').then((d) => d.Route))

const ForgotPasswordIndexLazyRoute = ForgotPasswordIndexLazyImport.update({
  id: '/forgot-password/',
  path: '/forgot-password/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/forgot-password/index.lazy').then((d) => d.Route),
)

const ContactIndexLazyRoute = ContactIndexLazyImport.update({
  id: '/contact/',
  path: '/contact/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/contact/index.lazy').then((d) => d.Route))

const AboutIndexLazyRoute = AboutIndexLazyImport.update({
  id: '/about/',
  path: '/about/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about/index.lazy').then((d) => d.Route))

const ChatIndexRoute = ChatIndexImport.update({
  id: '/chat/',
  path: '/chat/',
  getParentRoute: () => rootRoute,
} as any)

const SignUpVerifyRoute = SignUpVerifyImport.update({
  id: '/sign-up/verify',
  path: '/sign-up/verify',
  getParentRoute: () => rootRoute,
} as any)

const SignUpFinishRoute = SignUpFinishImport.update({
  id: '/sign-up/finish',
  path: '/sign-up/finish',
  getParentRoute: () => rootRoute,
} as any)

const SecurityTermsRoute = SecurityTermsImport.update({
  id: '/security/terms',
  path: '/security/terms',
  getParentRoute: () => rootRoute,
} as any)

const SecurityPrivacyRoute = SecurityPrivacyImport.update({
  id: '/security/privacy',
  path: '/security/privacy',
  getParentRoute: () => rootRoute,
} as any)

const SecurityCookiesRoute = SecurityCookiesImport.update({
  id: '/security/cookies',
  path: '/security/cookies',
  getParentRoute: () => rootRoute,
} as any)

const RecoverAccountVerifyRoute = RecoverAccountVerifyImport.update({
  id: '/recover-account/verify',
  path: '/recover-account/verify',
  getParentRoute: () => rootRoute,
} as any)

const RecoverAccountNewEmailRoute = RecoverAccountNewEmailImport.update({
  id: '/recover-account/new-email',
  path: '/recover-account/new-email',
  getParentRoute: () => rootRoute,
} as any)

const RecoverAccountFinishRoute = RecoverAccountFinishImport.update({
  id: '/recover-account/finish',
  path: '/recover-account/finish',
  getParentRoute: () => rootRoute,
} as any)

const ForgotPasswordVerifyRoute = ForgotPasswordVerifyImport.update({
  id: '/forgot-password/verify',
  path: '/forgot-password/verify',
  getParentRoute: () => rootRoute,
} as any)

const ForgotPasswordFinishRoute = ForgotPasswordFinishImport.update({
  id: '/forgot-password/finish',
  path: '/forgot-password/finish',
  getParentRoute: () => rootRoute,
} as any)

const Errors429Route = Errors429Import.update({
  id: '/errors/429',
  path: '/errors/429',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/errors/429': {
      id: '/errors/429'
      path: '/errors/429'
      fullPath: '/errors/429'
      preLoaderRoute: typeof Errors429Import
      parentRoute: typeof rootRoute
    }
    '/forgot-password/finish': {
      id: '/forgot-password/finish'
      path: '/forgot-password/finish'
      fullPath: '/forgot-password/finish'
      preLoaderRoute: typeof ForgotPasswordFinishImport
      parentRoute: typeof rootRoute
    }
    '/forgot-password/verify': {
      id: '/forgot-password/verify'
      path: '/forgot-password/verify'
      fullPath: '/forgot-password/verify'
      preLoaderRoute: typeof ForgotPasswordVerifyImport
      parentRoute: typeof rootRoute
    }
    '/recover-account/finish': {
      id: '/recover-account/finish'
      path: '/recover-account/finish'
      fullPath: '/recover-account/finish'
      preLoaderRoute: typeof RecoverAccountFinishImport
      parentRoute: typeof rootRoute
    }
    '/recover-account/new-email': {
      id: '/recover-account/new-email'
      path: '/recover-account/new-email'
      fullPath: '/recover-account/new-email'
      preLoaderRoute: typeof RecoverAccountNewEmailImport
      parentRoute: typeof rootRoute
    }
    '/recover-account/verify': {
      id: '/recover-account/verify'
      path: '/recover-account/verify'
      fullPath: '/recover-account/verify'
      preLoaderRoute: typeof RecoverAccountVerifyImport
      parentRoute: typeof rootRoute
    }
    '/security/cookies': {
      id: '/security/cookies'
      path: '/security/cookies'
      fullPath: '/security/cookies'
      preLoaderRoute: typeof SecurityCookiesImport
      parentRoute: typeof rootRoute
    }
    '/security/privacy': {
      id: '/security/privacy'
      path: '/security/privacy'
      fullPath: '/security/privacy'
      preLoaderRoute: typeof SecurityPrivacyImport
      parentRoute: typeof rootRoute
    }
    '/security/terms': {
      id: '/security/terms'
      path: '/security/terms'
      fullPath: '/security/terms'
      preLoaderRoute: typeof SecurityTermsImport
      parentRoute: typeof rootRoute
    }
    '/sign-up/finish': {
      id: '/sign-up/finish'
      path: '/sign-up/finish'
      fullPath: '/sign-up/finish'
      preLoaderRoute: typeof SignUpFinishImport
      parentRoute: typeof rootRoute
    }
    '/sign-up/verify': {
      id: '/sign-up/verify'
      path: '/sign-up/verify'
      fullPath: '/sign-up/verify'
      preLoaderRoute: typeof SignUpVerifyImport
      parentRoute: typeof rootRoute
    }
    '/chat/': {
      id: '/chat/'
      path: '/chat'
      fullPath: '/chat'
      preLoaderRoute: typeof ChatIndexImport
      parentRoute: typeof rootRoute
    }
    '/about/': {
      id: '/about/'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/contact/': {
      id: '/contact/'
      path: '/contact'
      fullPath: '/contact'
      preLoaderRoute: typeof ContactIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/forgot-password/': {
      id: '/forgot-password/'
      path: '/forgot-password'
      fullPath: '/forgot-password'
      preLoaderRoute: typeof ForgotPasswordIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/help/': {
      id: '/help/'
      path: '/help'
      fullPath: '/help'
      preLoaderRoute: typeof HelpIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/login/': {
      id: '/login/'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/recover-account/': {
      id: '/recover-account/'
      path: '/recover-account'
      fullPath: '/recover-account'
      preLoaderRoute: typeof RecoverAccountIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/security/': {
      id: '/security/'
      path: '/security'
      fullPath: '/security'
      preLoaderRoute: typeof SecurityIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/sign-up/': {
      id: '/sign-up/'
      path: '/sign-up'
      fullPath: '/sign-up'
      preLoaderRoute: typeof SignUpIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/errors/429': typeof Errors429Route
  '/forgot-password/finish': typeof ForgotPasswordFinishRoute
  '/forgot-password/verify': typeof ForgotPasswordVerifyRoute
  '/recover-account/finish': typeof RecoverAccountFinishRoute
  '/recover-account/new-email': typeof RecoverAccountNewEmailRoute
  '/recover-account/verify': typeof RecoverAccountVerifyRoute
  '/security/cookies': typeof SecurityCookiesRoute
  '/security/privacy': typeof SecurityPrivacyRoute
  '/security/terms': typeof SecurityTermsRoute
  '/sign-up/finish': typeof SignUpFinishRoute
  '/sign-up/verify': typeof SignUpVerifyRoute
  '/chat': typeof ChatIndexRoute
  '/about': typeof AboutIndexLazyRoute
  '/contact': typeof ContactIndexLazyRoute
  '/forgot-password': typeof ForgotPasswordIndexLazyRoute
  '/help': typeof HelpIndexLazyRoute
  '/login': typeof LoginIndexLazyRoute
  '/recover-account': typeof RecoverAccountIndexLazyRoute
  '/security': typeof SecurityIndexLazyRoute
  '/sign-up': typeof SignUpIndexLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/errors/429': typeof Errors429Route
  '/forgot-password/finish': typeof ForgotPasswordFinishRoute
  '/forgot-password/verify': typeof ForgotPasswordVerifyRoute
  '/recover-account/finish': typeof RecoverAccountFinishRoute
  '/recover-account/new-email': typeof RecoverAccountNewEmailRoute
  '/recover-account/verify': typeof RecoverAccountVerifyRoute
  '/security/cookies': typeof SecurityCookiesRoute
  '/security/privacy': typeof SecurityPrivacyRoute
  '/security/terms': typeof SecurityTermsRoute
  '/sign-up/finish': typeof SignUpFinishRoute
  '/sign-up/verify': typeof SignUpVerifyRoute
  '/chat': typeof ChatIndexRoute
  '/about': typeof AboutIndexLazyRoute
  '/contact': typeof ContactIndexLazyRoute
  '/forgot-password': typeof ForgotPasswordIndexLazyRoute
  '/help': typeof HelpIndexLazyRoute
  '/login': typeof LoginIndexLazyRoute
  '/recover-account': typeof RecoverAccountIndexLazyRoute
  '/security': typeof SecurityIndexLazyRoute
  '/sign-up': typeof SignUpIndexLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/errors/429': typeof Errors429Route
  '/forgot-password/finish': typeof ForgotPasswordFinishRoute
  '/forgot-password/verify': typeof ForgotPasswordVerifyRoute
  '/recover-account/finish': typeof RecoverAccountFinishRoute
  '/recover-account/new-email': typeof RecoverAccountNewEmailRoute
  '/recover-account/verify': typeof RecoverAccountVerifyRoute
  '/security/cookies': typeof SecurityCookiesRoute
  '/security/privacy': typeof SecurityPrivacyRoute
  '/security/terms': typeof SecurityTermsRoute
  '/sign-up/finish': typeof SignUpFinishRoute
  '/sign-up/verify': typeof SignUpVerifyRoute
  '/chat/': typeof ChatIndexRoute
  '/about/': typeof AboutIndexLazyRoute
  '/contact/': typeof ContactIndexLazyRoute
  '/forgot-password/': typeof ForgotPasswordIndexLazyRoute
  '/help/': typeof HelpIndexLazyRoute
  '/login/': typeof LoginIndexLazyRoute
  '/recover-account/': typeof RecoverAccountIndexLazyRoute
  '/security/': typeof SecurityIndexLazyRoute
  '/sign-up/': typeof SignUpIndexLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/errors/429'
    | '/forgot-password/finish'
    | '/forgot-password/verify'
    | '/recover-account/finish'
    | '/recover-account/new-email'
    | '/recover-account/verify'
    | '/security/cookies'
    | '/security/privacy'
    | '/security/terms'
    | '/sign-up/finish'
    | '/sign-up/verify'
    | '/chat'
    | '/about'
    | '/contact'
    | '/forgot-password'
    | '/help'
    | '/login'
    | '/recover-account'
    | '/security'
    | '/sign-up'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/errors/429'
    | '/forgot-password/finish'
    | '/forgot-password/verify'
    | '/recover-account/finish'
    | '/recover-account/new-email'
    | '/recover-account/verify'
    | '/security/cookies'
    | '/security/privacy'
    | '/security/terms'
    | '/sign-up/finish'
    | '/sign-up/verify'
    | '/chat'
    | '/about'
    | '/contact'
    | '/forgot-password'
    | '/help'
    | '/login'
    | '/recover-account'
    | '/security'
    | '/sign-up'
  id:
    | '__root__'
    | '/'
    | '/errors/429'
    | '/forgot-password/finish'
    | '/forgot-password/verify'
    | '/recover-account/finish'
    | '/recover-account/new-email'
    | '/recover-account/verify'
    | '/security/cookies'
    | '/security/privacy'
    | '/security/terms'
    | '/sign-up/finish'
    | '/sign-up/verify'
    | '/chat/'
    | '/about/'
    | '/contact/'
    | '/forgot-password/'
    | '/help/'
    | '/login/'
    | '/recover-account/'
    | '/security/'
    | '/sign-up/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  Errors429Route: typeof Errors429Route
  ForgotPasswordFinishRoute: typeof ForgotPasswordFinishRoute
  ForgotPasswordVerifyRoute: typeof ForgotPasswordVerifyRoute
  RecoverAccountFinishRoute: typeof RecoverAccountFinishRoute
  RecoverAccountNewEmailRoute: typeof RecoverAccountNewEmailRoute
  RecoverAccountVerifyRoute: typeof RecoverAccountVerifyRoute
  SecurityCookiesRoute: typeof SecurityCookiesRoute
  SecurityPrivacyRoute: typeof SecurityPrivacyRoute
  SecurityTermsRoute: typeof SecurityTermsRoute
  SignUpFinishRoute: typeof SignUpFinishRoute
  SignUpVerifyRoute: typeof SignUpVerifyRoute
  ChatIndexRoute: typeof ChatIndexRoute
  AboutIndexLazyRoute: typeof AboutIndexLazyRoute
  ContactIndexLazyRoute: typeof ContactIndexLazyRoute
  ForgotPasswordIndexLazyRoute: typeof ForgotPasswordIndexLazyRoute
  HelpIndexLazyRoute: typeof HelpIndexLazyRoute
  LoginIndexLazyRoute: typeof LoginIndexLazyRoute
  RecoverAccountIndexLazyRoute: typeof RecoverAccountIndexLazyRoute
  SecurityIndexLazyRoute: typeof SecurityIndexLazyRoute
  SignUpIndexLazyRoute: typeof SignUpIndexLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  Errors429Route: Errors429Route,
  ForgotPasswordFinishRoute: ForgotPasswordFinishRoute,
  ForgotPasswordVerifyRoute: ForgotPasswordVerifyRoute,
  RecoverAccountFinishRoute: RecoverAccountFinishRoute,
  RecoverAccountNewEmailRoute: RecoverAccountNewEmailRoute,
  RecoverAccountVerifyRoute: RecoverAccountVerifyRoute,
  SecurityCookiesRoute: SecurityCookiesRoute,
  SecurityPrivacyRoute: SecurityPrivacyRoute,
  SecurityTermsRoute: SecurityTermsRoute,
  SignUpFinishRoute: SignUpFinishRoute,
  SignUpVerifyRoute: SignUpVerifyRoute,
  ChatIndexRoute: ChatIndexRoute,
  AboutIndexLazyRoute: AboutIndexLazyRoute,
  ContactIndexLazyRoute: ContactIndexLazyRoute,
  ForgotPasswordIndexLazyRoute: ForgotPasswordIndexLazyRoute,
  HelpIndexLazyRoute: HelpIndexLazyRoute,
  LoginIndexLazyRoute: LoginIndexLazyRoute,
  RecoverAccountIndexLazyRoute: RecoverAccountIndexLazyRoute,
  SecurityIndexLazyRoute: SecurityIndexLazyRoute,
  SignUpIndexLazyRoute: SignUpIndexLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/errors/429",
        "/forgot-password/finish",
        "/forgot-password/verify",
        "/recover-account/finish",
        "/recover-account/new-email",
        "/recover-account/verify",
        "/security/cookies",
        "/security/privacy",
        "/security/terms",
        "/sign-up/finish",
        "/sign-up/verify",
        "/chat/",
        "/about/",
        "/contact/",
        "/forgot-password/",
        "/help/",
        "/login/",
        "/recover-account/",
        "/security/",
        "/sign-up/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/errors/429": {
      "filePath": "errors/429.tsx"
    },
    "/forgot-password/finish": {
      "filePath": "forgot-password/finish.tsx"
    },
    "/forgot-password/verify": {
      "filePath": "forgot-password/verify.tsx"
    },
    "/recover-account/finish": {
      "filePath": "recover-account/finish.tsx"
    },
    "/recover-account/new-email": {
      "filePath": "recover-account/new-email.tsx"
    },
    "/recover-account/verify": {
      "filePath": "recover-account/verify.tsx"
    },
    "/security/cookies": {
      "filePath": "security/cookies.tsx"
    },
    "/security/privacy": {
      "filePath": "security/privacy.tsx"
    },
    "/security/terms": {
      "filePath": "security/terms.tsx"
    },
    "/sign-up/finish": {
      "filePath": "sign-up/finish.tsx"
    },
    "/sign-up/verify": {
      "filePath": "sign-up/verify.tsx"
    },
    "/chat/": {
      "filePath": "chat/index.tsx"
    },
    "/about/": {
      "filePath": "about/index.lazy.tsx"
    },
    "/contact/": {
      "filePath": "contact/index.lazy.tsx"
    },
    "/forgot-password/": {
      "filePath": "forgot-password/index.lazy.tsx"
    },
    "/help/": {
      "filePath": "help/index.lazy.tsx"
    },
    "/login/": {
      "filePath": "login/index.lazy.tsx"
    },
    "/recover-account/": {
      "filePath": "recover-account/index.lazy.tsx"
    },
    "/security/": {
      "filePath": "security/index.lazy.tsx"
    },
    "/sign-up/": {
      "filePath": "sign-up/index.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */

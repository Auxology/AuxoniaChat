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
import { Route as SignUpIndexImport } from './routes/sign-up/index'
import { Route as SettingsIndexImport } from './routes/settings/index'
import { Route as RecoverAccountIndexImport } from './routes/recover-account/index'
import { Route as LoginIndexImport } from './routes/login/index'
import { Route as HelpIndexImport } from './routes/help/index'
import { Route as ForgotPasswordIndexImport } from './routes/forgot-password/index'
import { Route as ChatIndexImport } from './routes/chat/index'
import { Route as SignUpVerifyImport } from './routes/sign-up/verify'
import { Route as SignUpFinishImport } from './routes/sign-up/finish'
import { Route as SettingsSecurityImport } from './routes/settings/security'
import { Route as SecurityTermsImport } from './routes/security/terms'
import { Route as SecurityPrivacyImport } from './routes/security/privacy'
import { Route as SecurityCookiesImport } from './routes/security/cookies'
import { Route as RecoverAccountVerifyImport } from './routes/recover-account/verify'
import { Route as RecoverAccountNewEmailImport } from './routes/recover-account/new-email'
import { Route as RecoverAccountFinishImport } from './routes/recover-account/finish'
import { Route as LoginVerifyImport } from './routes/login/verify'
import { Route as ForgotPasswordVerifyImport } from './routes/forgot-password/verify'
import { Route as ForgotPasswordFinishImport } from './routes/forgot-password/finish'
import { Route as Errors429Import } from './routes/errors/429'
import { Route as ChatServersRequestsImport } from './routes/chat/servers/requests'
import { Route as ChatServersServerIdImport } from './routes/chat/servers/$serverId'
import { Route as ChatServersServerIdChannelsChannelIdImport } from './routes/chat/servers/$serverId/channels/$channelId'

// Create Virtual Routes

const SecurityIndexLazyImport = createFileRoute('/security/')()
const ContactIndexLazyImport = createFileRoute('/contact/')()
const AboutIndexLazyImport = createFileRoute('/about/')()

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const SecurityIndexLazyRoute = SecurityIndexLazyImport.update({
  id: '/security/',
  path: '/security/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/security/index.lazy').then((d) => d.Route),
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

const SignUpIndexRoute = SignUpIndexImport.update({
  id: '/sign-up/',
  path: '/sign-up/',
  getParentRoute: () => rootRoute,
} as any)

const SettingsIndexRoute = SettingsIndexImport.update({
  id: '/settings/',
  path: '/settings/',
  getParentRoute: () => rootRoute,
} as any)

const RecoverAccountIndexRoute = RecoverAccountIndexImport.update({
  id: '/recover-account/',
  path: '/recover-account/',
  getParentRoute: () => rootRoute,
} as any)

const LoginIndexRoute = LoginIndexImport.update({
  id: '/login/',
  path: '/login/',
  getParentRoute: () => rootRoute,
} as any)

const HelpIndexRoute = HelpIndexImport.update({
  id: '/help/',
  path: '/help/',
  getParentRoute: () => rootRoute,
} as any)

const ForgotPasswordIndexRoute = ForgotPasswordIndexImport.update({
  id: '/forgot-password/',
  path: '/forgot-password/',
  getParentRoute: () => rootRoute,
} as any)

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

const SettingsSecurityRoute = SettingsSecurityImport.update({
  id: '/settings/security',
  path: '/settings/security',
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

const LoginVerifyRoute = LoginVerifyImport.update({
  id: '/login/verify',
  path: '/login/verify',
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

const ChatServersRequestsRoute = ChatServersRequestsImport.update({
  id: '/chat/servers/requests',
  path: '/chat/servers/requests',
  getParentRoute: () => rootRoute,
} as any)

const ChatServersServerIdRoute = ChatServersServerIdImport.update({
  id: '/chat/servers/$serverId',
  path: '/chat/servers/$serverId',
  getParentRoute: () => rootRoute,
} as any)

const ChatServersServerIdChannelsChannelIdRoute =
  ChatServersServerIdChannelsChannelIdImport.update({
    id: '/channels/$channelId',
    path: '/channels/$channelId',
    getParentRoute: () => ChatServersServerIdRoute,
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
    '/login/verify': {
      id: '/login/verify'
      path: '/login/verify'
      fullPath: '/login/verify'
      preLoaderRoute: typeof LoginVerifyImport
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
    '/settings/security': {
      id: '/settings/security'
      path: '/settings/security'
      fullPath: '/settings/security'
      preLoaderRoute: typeof SettingsSecurityImport
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
    '/forgot-password/': {
      id: '/forgot-password/'
      path: '/forgot-password'
      fullPath: '/forgot-password'
      preLoaderRoute: typeof ForgotPasswordIndexImport
      parentRoute: typeof rootRoute
    }
    '/help/': {
      id: '/help/'
      path: '/help'
      fullPath: '/help'
      preLoaderRoute: typeof HelpIndexImport
      parentRoute: typeof rootRoute
    }
    '/login/': {
      id: '/login/'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginIndexImport
      parentRoute: typeof rootRoute
    }
    '/recover-account/': {
      id: '/recover-account/'
      path: '/recover-account'
      fullPath: '/recover-account'
      preLoaderRoute: typeof RecoverAccountIndexImport
      parentRoute: typeof rootRoute
    }
    '/settings/': {
      id: '/settings/'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsIndexImport
      parentRoute: typeof rootRoute
    }
    '/sign-up/': {
      id: '/sign-up/'
      path: '/sign-up'
      fullPath: '/sign-up'
      preLoaderRoute: typeof SignUpIndexImport
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
    '/security/': {
      id: '/security/'
      path: '/security'
      fullPath: '/security'
      preLoaderRoute: typeof SecurityIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/chat/servers/$serverId': {
      id: '/chat/servers/$serverId'
      path: '/chat/servers/$serverId'
      fullPath: '/chat/servers/$serverId'
      preLoaderRoute: typeof ChatServersServerIdImport
      parentRoute: typeof rootRoute
    }
    '/chat/servers/requests': {
      id: '/chat/servers/requests'
      path: '/chat/servers/requests'
      fullPath: '/chat/servers/requests'
      preLoaderRoute: typeof ChatServersRequestsImport
      parentRoute: typeof rootRoute
    }
    '/chat/servers/$serverId/channels/$channelId': {
      id: '/chat/servers/$serverId/channels/$channelId'
      path: '/channels/$channelId'
      fullPath: '/chat/servers/$serverId/channels/$channelId'
      preLoaderRoute: typeof ChatServersServerIdChannelsChannelIdImport
      parentRoute: typeof ChatServersServerIdImport
    }
  }
}

// Create and export the route tree

interface ChatServersServerIdRouteChildren {
  ChatServersServerIdChannelsChannelIdRoute: typeof ChatServersServerIdChannelsChannelIdRoute
}

const ChatServersServerIdRouteChildren: ChatServersServerIdRouteChildren = {
  ChatServersServerIdChannelsChannelIdRoute:
    ChatServersServerIdChannelsChannelIdRoute,
}

const ChatServersServerIdRouteWithChildren =
  ChatServersServerIdRoute._addFileChildren(ChatServersServerIdRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/errors/429': typeof Errors429Route
  '/forgot-password/finish': typeof ForgotPasswordFinishRoute
  '/forgot-password/verify': typeof ForgotPasswordVerifyRoute
  '/login/verify': typeof LoginVerifyRoute
  '/recover-account/finish': typeof RecoverAccountFinishRoute
  '/recover-account/new-email': typeof RecoverAccountNewEmailRoute
  '/recover-account/verify': typeof RecoverAccountVerifyRoute
  '/security/cookies': typeof SecurityCookiesRoute
  '/security/privacy': typeof SecurityPrivacyRoute
  '/security/terms': typeof SecurityTermsRoute
  '/settings/security': typeof SettingsSecurityRoute
  '/sign-up/finish': typeof SignUpFinishRoute
  '/sign-up/verify': typeof SignUpVerifyRoute
  '/chat': typeof ChatIndexRoute
  '/forgot-password': typeof ForgotPasswordIndexRoute
  '/help': typeof HelpIndexRoute
  '/login': typeof LoginIndexRoute
  '/recover-account': typeof RecoverAccountIndexRoute
  '/settings': typeof SettingsIndexRoute
  '/sign-up': typeof SignUpIndexRoute
  '/about': typeof AboutIndexLazyRoute
  '/contact': typeof ContactIndexLazyRoute
  '/security': typeof SecurityIndexLazyRoute
  '/chat/servers/$serverId': typeof ChatServersServerIdRouteWithChildren
  '/chat/servers/requests': typeof ChatServersRequestsRoute
  '/chat/servers/$serverId/channels/$channelId': typeof ChatServersServerIdChannelsChannelIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/errors/429': typeof Errors429Route
  '/forgot-password/finish': typeof ForgotPasswordFinishRoute
  '/forgot-password/verify': typeof ForgotPasswordVerifyRoute
  '/login/verify': typeof LoginVerifyRoute
  '/recover-account/finish': typeof RecoverAccountFinishRoute
  '/recover-account/new-email': typeof RecoverAccountNewEmailRoute
  '/recover-account/verify': typeof RecoverAccountVerifyRoute
  '/security/cookies': typeof SecurityCookiesRoute
  '/security/privacy': typeof SecurityPrivacyRoute
  '/security/terms': typeof SecurityTermsRoute
  '/settings/security': typeof SettingsSecurityRoute
  '/sign-up/finish': typeof SignUpFinishRoute
  '/sign-up/verify': typeof SignUpVerifyRoute
  '/chat': typeof ChatIndexRoute
  '/forgot-password': typeof ForgotPasswordIndexRoute
  '/help': typeof HelpIndexRoute
  '/login': typeof LoginIndexRoute
  '/recover-account': typeof RecoverAccountIndexRoute
  '/settings': typeof SettingsIndexRoute
  '/sign-up': typeof SignUpIndexRoute
  '/about': typeof AboutIndexLazyRoute
  '/contact': typeof ContactIndexLazyRoute
  '/security': typeof SecurityIndexLazyRoute
  '/chat/servers/$serverId': typeof ChatServersServerIdRouteWithChildren
  '/chat/servers/requests': typeof ChatServersRequestsRoute
  '/chat/servers/$serverId/channels/$channelId': typeof ChatServersServerIdChannelsChannelIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/errors/429': typeof Errors429Route
  '/forgot-password/finish': typeof ForgotPasswordFinishRoute
  '/forgot-password/verify': typeof ForgotPasswordVerifyRoute
  '/login/verify': typeof LoginVerifyRoute
  '/recover-account/finish': typeof RecoverAccountFinishRoute
  '/recover-account/new-email': typeof RecoverAccountNewEmailRoute
  '/recover-account/verify': typeof RecoverAccountVerifyRoute
  '/security/cookies': typeof SecurityCookiesRoute
  '/security/privacy': typeof SecurityPrivacyRoute
  '/security/terms': typeof SecurityTermsRoute
  '/settings/security': typeof SettingsSecurityRoute
  '/sign-up/finish': typeof SignUpFinishRoute
  '/sign-up/verify': typeof SignUpVerifyRoute
  '/chat/': typeof ChatIndexRoute
  '/forgot-password/': typeof ForgotPasswordIndexRoute
  '/help/': typeof HelpIndexRoute
  '/login/': typeof LoginIndexRoute
  '/recover-account/': typeof RecoverAccountIndexRoute
  '/settings/': typeof SettingsIndexRoute
  '/sign-up/': typeof SignUpIndexRoute
  '/about/': typeof AboutIndexLazyRoute
  '/contact/': typeof ContactIndexLazyRoute
  '/security/': typeof SecurityIndexLazyRoute
  '/chat/servers/$serverId': typeof ChatServersServerIdRouteWithChildren
  '/chat/servers/requests': typeof ChatServersRequestsRoute
  '/chat/servers/$serverId/channels/$channelId': typeof ChatServersServerIdChannelsChannelIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/errors/429'
    | '/forgot-password/finish'
    | '/forgot-password/verify'
    | '/login/verify'
    | '/recover-account/finish'
    | '/recover-account/new-email'
    | '/recover-account/verify'
    | '/security/cookies'
    | '/security/privacy'
    | '/security/terms'
    | '/settings/security'
    | '/sign-up/finish'
    | '/sign-up/verify'
    | '/chat'
    | '/forgot-password'
    | '/help'
    | '/login'
    | '/recover-account'
    | '/settings'
    | '/sign-up'
    | '/about'
    | '/contact'
    | '/security'
    | '/chat/servers/$serverId'
    | '/chat/servers/requests'
    | '/chat/servers/$serverId/channels/$channelId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/errors/429'
    | '/forgot-password/finish'
    | '/forgot-password/verify'
    | '/login/verify'
    | '/recover-account/finish'
    | '/recover-account/new-email'
    | '/recover-account/verify'
    | '/security/cookies'
    | '/security/privacy'
    | '/security/terms'
    | '/settings/security'
    | '/sign-up/finish'
    | '/sign-up/verify'
    | '/chat'
    | '/forgot-password'
    | '/help'
    | '/login'
    | '/recover-account'
    | '/settings'
    | '/sign-up'
    | '/about'
    | '/contact'
    | '/security'
    | '/chat/servers/$serverId'
    | '/chat/servers/requests'
    | '/chat/servers/$serverId/channels/$channelId'
  id:
    | '__root__'
    | '/'
    | '/errors/429'
    | '/forgot-password/finish'
    | '/forgot-password/verify'
    | '/login/verify'
    | '/recover-account/finish'
    | '/recover-account/new-email'
    | '/recover-account/verify'
    | '/security/cookies'
    | '/security/privacy'
    | '/security/terms'
    | '/settings/security'
    | '/sign-up/finish'
    | '/sign-up/verify'
    | '/chat/'
    | '/forgot-password/'
    | '/help/'
    | '/login/'
    | '/recover-account/'
    | '/settings/'
    | '/sign-up/'
    | '/about/'
    | '/contact/'
    | '/security/'
    | '/chat/servers/$serverId'
    | '/chat/servers/requests'
    | '/chat/servers/$serverId/channels/$channelId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  Errors429Route: typeof Errors429Route
  ForgotPasswordFinishRoute: typeof ForgotPasswordFinishRoute
  ForgotPasswordVerifyRoute: typeof ForgotPasswordVerifyRoute
  LoginVerifyRoute: typeof LoginVerifyRoute
  RecoverAccountFinishRoute: typeof RecoverAccountFinishRoute
  RecoverAccountNewEmailRoute: typeof RecoverAccountNewEmailRoute
  RecoverAccountVerifyRoute: typeof RecoverAccountVerifyRoute
  SecurityCookiesRoute: typeof SecurityCookiesRoute
  SecurityPrivacyRoute: typeof SecurityPrivacyRoute
  SecurityTermsRoute: typeof SecurityTermsRoute
  SettingsSecurityRoute: typeof SettingsSecurityRoute
  SignUpFinishRoute: typeof SignUpFinishRoute
  SignUpVerifyRoute: typeof SignUpVerifyRoute
  ChatIndexRoute: typeof ChatIndexRoute
  ForgotPasswordIndexRoute: typeof ForgotPasswordIndexRoute
  HelpIndexRoute: typeof HelpIndexRoute
  LoginIndexRoute: typeof LoginIndexRoute
  RecoverAccountIndexRoute: typeof RecoverAccountIndexRoute
  SettingsIndexRoute: typeof SettingsIndexRoute
  SignUpIndexRoute: typeof SignUpIndexRoute
  AboutIndexLazyRoute: typeof AboutIndexLazyRoute
  ContactIndexLazyRoute: typeof ContactIndexLazyRoute
  SecurityIndexLazyRoute: typeof SecurityIndexLazyRoute
  ChatServersServerIdRoute: typeof ChatServersServerIdRouteWithChildren
  ChatServersRequestsRoute: typeof ChatServersRequestsRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  Errors429Route: Errors429Route,
  ForgotPasswordFinishRoute: ForgotPasswordFinishRoute,
  ForgotPasswordVerifyRoute: ForgotPasswordVerifyRoute,
  LoginVerifyRoute: LoginVerifyRoute,
  RecoverAccountFinishRoute: RecoverAccountFinishRoute,
  RecoverAccountNewEmailRoute: RecoverAccountNewEmailRoute,
  RecoverAccountVerifyRoute: RecoverAccountVerifyRoute,
  SecurityCookiesRoute: SecurityCookiesRoute,
  SecurityPrivacyRoute: SecurityPrivacyRoute,
  SecurityTermsRoute: SecurityTermsRoute,
  SettingsSecurityRoute: SettingsSecurityRoute,
  SignUpFinishRoute: SignUpFinishRoute,
  SignUpVerifyRoute: SignUpVerifyRoute,
  ChatIndexRoute: ChatIndexRoute,
  ForgotPasswordIndexRoute: ForgotPasswordIndexRoute,
  HelpIndexRoute: HelpIndexRoute,
  LoginIndexRoute: LoginIndexRoute,
  RecoverAccountIndexRoute: RecoverAccountIndexRoute,
  SettingsIndexRoute: SettingsIndexRoute,
  SignUpIndexRoute: SignUpIndexRoute,
  AboutIndexLazyRoute: AboutIndexLazyRoute,
  ContactIndexLazyRoute: ContactIndexLazyRoute,
  SecurityIndexLazyRoute: SecurityIndexLazyRoute,
  ChatServersServerIdRoute: ChatServersServerIdRouteWithChildren,
  ChatServersRequestsRoute: ChatServersRequestsRoute,
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
        "/login/verify",
        "/recover-account/finish",
        "/recover-account/new-email",
        "/recover-account/verify",
        "/security/cookies",
        "/security/privacy",
        "/security/terms",
        "/settings/security",
        "/sign-up/finish",
        "/sign-up/verify",
        "/chat/",
        "/forgot-password/",
        "/help/",
        "/login/",
        "/recover-account/",
        "/settings/",
        "/sign-up/",
        "/about/",
        "/contact/",
        "/security/",
        "/chat/servers/$serverId",
        "/chat/servers/requests"
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
    "/login/verify": {
      "filePath": "login/verify.tsx"
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
    "/settings/security": {
      "filePath": "settings/security.tsx"
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
    "/forgot-password/": {
      "filePath": "forgot-password/index.tsx"
    },
    "/help/": {
      "filePath": "help/index.tsx"
    },
    "/login/": {
      "filePath": "login/index.tsx"
    },
    "/recover-account/": {
      "filePath": "recover-account/index.tsx"
    },
    "/settings/": {
      "filePath": "settings/index.tsx"
    },
    "/sign-up/": {
      "filePath": "sign-up/index.tsx"
    },
    "/about/": {
      "filePath": "about/index.lazy.tsx"
    },
    "/contact/": {
      "filePath": "contact/index.lazy.tsx"
    },
    "/security/": {
      "filePath": "security/index.lazy.tsx"
    },
    "/chat/servers/$serverId": {
      "filePath": "chat/servers/$serverId.tsx",
      "children": [
        "/chat/servers/$serverId/channels/$channelId"
      ]
    },
    "/chat/servers/requests": {
      "filePath": "chat/servers/requests.tsx"
    },
    "/chat/servers/$serverId/channels/$channelId": {
      "filePath": "chat/servers/$serverId/channels/$channelId.tsx",
      "parent": "/chat/servers/$serverId"
    }
  }
}
ROUTE_MANIFEST_END */

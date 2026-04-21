import { App, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function getFirebaseApp(): App {
  if (getApps().length > 0) return getApps()[0]!

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey || privateKey.includes('YOUR_KEY_HERE')) {
    // If we return initializeApp without credentials, on local environments it tries to fetch Application Default Credentials and hangs forever!
    // We must provide a dummy certificate so it fails FASt (Permissions denied) rather than hanging.
    console.warn('Firebase Admin is missing credentials. Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY are set.')
    return initializeApp({
      credential: cert({
        projectId: 'demo-saqib-rice-mills',
        clientEmail: 'dummy@demo-saqib-rice-mills.iam.gserviceaccount.com',
        privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQC9aItmEorZxKWH\nK4BnpQmYbwdhi894M+4VoxLIFcrmrn+D7t5naPliy//N5XGJVse9oyxSkuS55QlB\nUITJHyjj0bSMjDXWZA+huwNiI1YGLCxUZbMuIJIaPUKbtcGVEhcbx50w9labOFet\nICCPq5MEgvvcBJ4QtgtAVcToZyZ+PDHryn4txJT4liP+8HmKUexrUXRFwBldJYYE\n3MIbrY8UbKkbknVXQZjnrD06yQ37kk8c5tv9FvxxYv+1pE3msWdNyNoaYOqXHWXO\ncBL+zer5k5CfoUFYG9fzEK9yf9xJuJTINVaNPfd9rAJEnzltXymSwiaUy7DC3XSw\nl/J1yOgrAgMBAAECgf8PVSBgoC/53duIcj5qkmPzGR+Vn8aeFRNca6twspRH1t3N\nY102HQfyadf0JJ61F+8+8ttR9JItXvWMaccv3VXe+qL/jJtyfhl/CQEcbettjwqg\nIYWmgoSi7NVRY3sBZTmU5W2oiQGf5jaEcKL2Okn4rAk/hOmzrIYsTQZ9cop6JTwz\nPuQiddXBxp6f1/tI0Kth8LihQrWWfUuhYADDn7HddPsWy/3wSFNhODt8S50yEPX7\nfcJApIadoUKfIe0b9X2CSRbBB4WV1Iek+Z54n1gmLj26nsLj0vngz+Mhv7SeY2hU\nUekHoPjxWP2/pDf7TtIWfF+RMf52BgG9ILSiWkECgYEA3pN0406Y2Z0nbWHApwr5\nY5ZwVEwStn7KDddovn7cCJ4JP5pIhCczjfpnvztrwghqAsfM60cb3LNJnfGX2Ulm\n3CE9SgcG6cdPCuBShi/WF8xWMraYkUjpPC1GlSYCxmJi264XYG1MkXjWp0Wh0IfH\noo8l0w+nu4mMY7B/oTj9gVECgYEA2doET/9c/pZiLTOWM3o8MTs2DV3Ha9Zh57dO\nfWzcrV4sR/N6F2mkRcSgBMscuUTnz6yPNQ8dqje07zeTF70y16lFGQyiSrJ9CA6D\nsRYasf19aH0lU0kmEguxI+2iDSho2T0F+W0grlWDHZ5WIEdumgsgWsAWdHnCFpDU\nzI5X0rsCgYBAias7+d9SQkJbchvFk+YKXWXG26QVbKAz8UD685fjm8d8vMTIJQHK\n6k/I4Hb3dS8gDUU694x5qzbuaE4qgCEmNTErVOxJPzSJJ9Bl/lrq3aIk5FNK1URj\n4ZD00Ge/lGmr30gB+s9X4x0Ctasc5zIYzb8e+wwc0d52TYhEfFztcQKBgH8kv8mU\np0iqqifpaKsolwLApP5OEjp8x20+TZ/kLjM8uClSD5qkfEx/wkip5ly2u3g4JOh5\npv2WP5Ix5DZBpO+7CenhtsJTw6c1GWT8Gp5w7IVULLmcAo0bp8npQd/eCrtm4xq8\ntwsoOzrJE0kJh6J+BecRHsnh2gXjh17PYLBLAoGAGX4J+qA0TAmjlA4eprNQ/orT\nlZIAwXuqswgpyUV2c3F2uM0gUYvbVTuVTyu3Qd19SWCcqD2H89peMq0kH4zorFGc\nR77Uq1nUuBFiOVuTkIe9bzLqCajXZEOAGHfrYZ4gankzc2Dw4h0UKRtRLGwhU6Fv\nmJRdtWOsDNS4aUxYaGE=\n-----END PRIVATE KEY-----',
      }),
    })
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })
}

const app = getFirebaseApp()
export const db = getFirestore(app)

import Docuemnt, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Docuemnt {
  render() {
    return (
      <Html>
        <Head >
            <script
                async
                src={`http://res.wx.qq.com/open/js/jweixin-1.6.0.js`}
            />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument

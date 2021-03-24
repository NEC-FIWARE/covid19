const fiwareClient = {
  /**
   * Fiwareからデータを取得します。
   * @param dataType- データタイプ
   * @returns Promise<any>
   */
  get: async (dataType: string): Promise<any> => {
    // 環境変数を取得する
    const brokerVersion = process.env.NUXT_ENV_BROKER_VERSION || 'v2'
    const brokerUrl = process.env.NUXT_ENV_BROKER_URL || ''
    const municipalityCode = process.env.NUXT_ENV_MUNICIPALITY_CODE || ''
    const brokerService = process.env.NUXT_ENV_BROKER_SERVICE || ''
    const brokerPath = process.env.NUXT_ENV_BROKER_PATH || '/'
    const brokerContext =
      process.env.NUXT_ENV_BROKER_CONTEXT ||
      'https://cio-context.fiware-testbed.jp/cio-context-en.jsonld'

    if (municipalityCode === '') {
      throw new Error('The env parameter MUNICIPALITY_CODE is not set.')
    }

    // URLを構築する
    let url
    let headers

    const entityId = `urn:ngsi-ld:${dataType}:${municipalityCode}`

    if (brokerVersion === 'ld') {
      url = `${brokerUrl}/ngsi-ld/v1/entities/${entityId}?options=keyValues`
      headers = {
        'NGSILD-Tenant': brokerService,
        LINK: `<${brokerContext}>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"`,
      }
    } else {
      url = `${brokerUrl}/v2/entities/${entityId}?type=${dataType}&options=keyValues`
      headers = {
        'Fiware-Service': brokerService,
        'Fiware-ServicePath': brokerPath,
      }
    }

    // APIを呼び出す
    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    // レスポンスが 200 OK でないときはエラーをスローする
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err)
    }

    // データを返す
    return await response.json()
  },
}
export default fiwareClient

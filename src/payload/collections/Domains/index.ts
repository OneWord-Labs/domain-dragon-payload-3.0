import { CollectionConfig } from 'payload/types'
import { loggedIn } from '../../access/loggedIn'
import adminOrOwner from './access/adminOrOwner'
import { DomainsLayout } from './ui'
import { checkDomain } from './endpoints/checkDomain'
import { addDomain } from './endpoints/addDomain'
import { getDomain } from './endpoints/getDomain'
import { removeDomain } from './endpoints/removeDomain'
import { verifyDomain } from './endpoints/verifyDomain'
import { importDomains } from './endpoints/importDomains'
import { DataUploader } from '@/payload/components/ImportComponent'
const baseUrl = ''
const Domains: CollectionConfig = {
  slug: 'domains',
  admin: {
    useAsTitle: 'name',
    components: {
      views: {
        List: DomainsLayout,
      },
    },
  },
  hooks: {
    // beforeChange: [
    //   async ({ data, req }) => {
    //     req.payload.create({
    //       collection: 'sites',
    //       data: {},
    //     })
    //     return data
    //   },
    // ],
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      required: true,
      type: 'text',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Not Active',
          value: 'notActive',
        },
      ],
      defaultValue: 'notActive',
    },
    {
      name: 'aiEnabled',
      label: 'AI Content',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'traffic',
      label: 'Traffic',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'revenue',
      label: 'Revenue',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'conversion',
      label: 'Conversion',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'record',
      type: 'group',
      fields: [
        {
          name: 'CNAME',
          type: 'text',
        },
        {
          name: 'TXT',
          type: 'text',
        },
        {
          name: 'A',
          type: 'text',
        },
      ],
    },

    {
      name: 'user',
      label: 'User',
      required: true,
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  access: {
    read: () => true,
    create: loggedIn,
    delete: adminOrOwner,
    update: adminOrOwner,
    // admin: admin,
  },
  endpoints: [
    {
      path: '/import',
      method: 'post',
      handler: importDomains,
    },
    {
      path: '/check-domain',
      method: 'get',
      handler: checkDomain,
    },
    {
      path: '/add-domain',
      method: 'get',
      handler: addDomain,
    },
    {
      path: '/get-domain',
      method: 'get',
      handler: getDomain,
    },
    {
      path: '/get-domain',
      method: 'get',
      handler: getDomain,
    },
    {
      path: '/remove-domain',
      method: 'get',
      handler: removeDomain,
    },
    {
      path: '/verify-domain',
      method: 'get',
      handler: verifyDomain,
    },
    {
      path: '/get-a-record',
      method: 'get',
      handler: async (req) => {
        const { domain } = req.query

        const [configResponse, domainResponse] = await Promise.all([
          fetch(
            `https://api.vercel.com/v6/domains/${domain}/config?teamId=${process.env.TEAM_ID_VERCEL}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
                'Content-Type': 'application/json',
              },
            },
          ),
          fetch(
            `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
                'Content-Type': 'application/json',
              },
            },
          ),
        ])
        const configJson = await configResponse.json()
        const domainJson = await domainResponse.json()
        console.log({
          configJson,
          domainJson,
        })

        return new Response(JSON.stringify({ configJson, domainJson }))
      },
    },
    {
      path: '/set-a-record',
      method: 'get',
      handler: async (req) => {
        const { domain } = req.query

        const response = await fetch(
          `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`,
          {
            body: `{\n  "name": "${domain}"\n}`,
            headers: {
              Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
              'Content-Type': 'application/json',
            },
            method: 'POST',
          },
        )

        const data = await response.json()

        // console.log({ data: data.verification })
        // domain -> test2.com

        // txt , CNAME - ?
        // req -> vercel -> domain -> CNAME: abcd, txt: xyz

        //  data : {
        //   name: 'test.com',
        //   apexName: 'test.com',
        //   projectId: 'prj_rneNezA76JWMXPKdQVEGIlke780i',
        //   redirect: null,
        //   redirectStatusCode: null,
        //   gitBranch: null,
        //   customEnvironmentId: null,
        //   updatedAt: 1715528943102,
        //   createdAt: 1715528943102,
        //   verified: false,
        //   verification: [[Object]],
        // }

        //[
        //   {
        //     type: 'TXT',
        //     domain: '_vercel.test2.com',
        //     value: 'vc-domain-verify=test2.com,3a16f5dc6fd5b66726e0',
        //     reason: 'pending_domain_verification',
        //   }
        // ]

        return new Response('CNAME, TXT')
      },
    },
  ],
}

export default Domains

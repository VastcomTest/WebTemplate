<template>
  <table>
    <thead>
      <tr>
        <th>Claim</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(claim, index) in claims"
        :key="index"
      >
        <td>{{claim.claim}}</td>
        <td :id="'claim-' + claim.claim">{{claim.value}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
export default {
  name: 'Profile',
  data () {
    return {
      claims: [] as any[]
    }
  },
  async created () {
    const idToken = await this.$auth.tokenManager.get('idToken')
    console.log(idToken)
    //@ts-ignore
    this.claims = Object.entries(idToken.claims).map(entry => ({ claim: entry[0], value: entry[1] }))
  }
}
</script>
<style>
.dashboard svg {
  max-width: 100%;
}
.dashboard g {
  fill: cornflowerblue;
}
</style>

<template>
  <div class="container dashboard">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Designs by {{viewedUser.displayName}}</div>
          <div class="card-body">
            <div v-if="user.loggedIn" class="alert alert-success" role="alert">You are logged in!</div>

            <div v-for="design in designs" :key="design.id">
              <h3><router-link :to="design.link">{{ design.data.designName }}</router-link></h3>
              <div v-html="design.data.svg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { State, Getter, Action, Mutation, namespace } from "vuex-class";
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import * as _ from 'lodash';

@Component({})
export default class Dashboard extends Vue {
  @Prop(String) uid: string;
  @Getter user;
  viewedUser: any = {};
  designs = [];

  getLink(design) {
    const params = new URLSearchParams();
    console.log(design);
    console.log(design.params);
    _.forEach(design.params, (v, k) => {
      params.set(k, v);
    });
    console.log(params.toString());

    const link = '/newPlayground/' + 
    design.outerDesign + '/' + 
    design.innerDesign + '?' +
    params.toString();

    console.log(link);
    
    return link;
  }

  mounted() {
    const db = firebase.firestore();

    const uid = this.uid ? this.uid : this.user.data.uid;

    const self = this;

    db.collection("saved")
      .where("user.uid", "==", uid)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.docs.map(doc => {
          self.viewedUser = doc.data().user;
          self.designs.push({
            id: doc.id,
            data: doc.data(),
            link: self.getLink(doc.data()),
          });
        });
        console.log(self.designs);
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  }
}
</script>

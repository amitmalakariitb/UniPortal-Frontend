<template>
  <div class="main-container">
    <div class="container">
      <div class="Upvote" @click="Upvote" v-if="windowWidth > 750">
        <upvote
          v-if="AuthStore.role == 7669 || AuthStore.role == 1980"
          :upvotes="upvotes"
        />
      </div>

      <div class="QuestionBox">
        <div class="content" :style="{ background: colourStore.background }">
          <div class="inner-container">
            <div class="stamps">
              <div class="info">
                <div class="name" :style="{ color: colourStore.emphasis_text }">
                  {{ showName }}
                </div>
                <div class="timestamp" :style="{ color: colourStore.grey }">
                  {{ timestamp }}
                </div>
              </div>
              <div
                v-if="question.verified"
                class="verified"
                :style="{ color: colourStore.grey }"
              >
                <verified class="icon" />&nbsp;&nbsp;
                <p>Verified</p>
              </div>
            </div>
            <div class="images" v-if="question.images">
              <div
                v-for="image in images"
                v-bind:key="image.id"
                class="img"
                @click="Expand(image)"
              >
                <img :src="image" />
              </div>
            </div>
            <div class="text" :style="{ color: colourStore.emphasis_text }">
              {{ question["body"] }}
            </div>
          </div>
        </div>
        <div class="box-footer">
          <div
            class="Upvote"
            @click="Upvote"
            v-if="
              windowWidth <= 750 &&
              (AuthStore.role == 7669 || AuthStore.role == 1980)
            "
          >
            <upvote
              :background="primaryAccent"
              :primaryColor1="primaryColor"
              :upvotes="upvotes"
              :windowWidth="windowWidth"
            />
          </div>
          <div
            v-if="
              showAnswerBox &&
              (AuthStore.role == 5980 || AuthStore.role == 6311)
            "
            @click="AnswerClick"
            class="answer"
            :style="{
              color: colourStore.emphasis_text,
              background: colourStore.background,
            }"
          >
            <forum class="icon" />&nbsp;
            <p>Answer</p>
          </div>
          <div class="Hide" v-if="windowWidth <= 750" @click="Hide">
            <eye
              v-if="AuthStore.role == 5980 && !question['hidden']"
              class="icon"
              :svgColor="secondaryColor"
            /><closed_eye
              v-if="AuthStore.role == 5980 && question['hidden']"
              class="icon"
              :svgColor="secondaryColor"
            />
          </div>
          <div class="Hide">
            <alert
              v-if="question['hidden'] && AuthStore.role == 7669 && windowWidth <= 750"
              @click = "alertClick"
            />
          </div>
          <div class="comments">
            <button
              class="view-comments"
              @click="viewComments"
              :style="{ color: colourStore.emphasis_text }"
            >
              {{ commentbtn_text }} ({{ question.comments.length }})
            </button>
            <button
              class="comment"
              @click="CommentClick"
              :style="{
                color: colourStore.emphasis_text,
                background: colourStore.background,
              }"
            >
              <Uparrow class="icon" />&nbsp;
              <p>Comment</p>
            </button>
          </div>
        </div>
      </div>
      <div class="Hide" v-if="windowWidth > 750" >
        <eye
          v-if="AuthStore.role == 5980 && !question['hidden']"
          class="icon"
          :svgColor="secondaryColor"
          @click="Hide"
        /><closed_eye
          v-if="AuthStore.role == 5980 && question['hidden']"
          class="icon"
          :svgColor="secondaryColor"
          @click="Hide"
        /><alert
          v-if="question['hidden'] && AuthStore.role == 7669 && windowWidth > 750"
          @click = "alertClick"
        />
      </div>
    </div>
    <div class="Lister" v-if="showComments">
      <div :key="comment['id']" v-for="comment in comments" class="comment-box">
        <viewcomments :comment="comment" :isAnswer="isAnswer" />
      </div>
    </div>
  </div>
</template>

<script>
import upvote from "../common/upvote.vue";

import viewcomments from "../common/viewcomments.vue";
import verified from "../icons/new_releases.svg";
import Uparrow from "../icons/add_comment.svg";
import eye from "../icons/visibility.svg";
import closed_eye from "../icons/visibility_off.svg";
import forum from "../icons/send.svg";
import alert from "../icons/Alert.svg";

import { useQuestionStore } from "@/stores/question";
import { useAuthStore } from "@/stores/auth";
import { useColourStore } from "../../stores/colour";

export default {
  name: "Question",
  setup() {
    const questionStore = useQuestionStore();
    const AuthStore = useAuthStore();
    const colourStore = useColourStore();
    return {
      questionStore,
      AuthStore,
      colourStore,
    };
  },
  components: {
    upvote,
    verified,
    Uparrow,
    eye,
    closed_eye,
    viewcomments,
    forum,
    alert,
  },
  data() {
    return {
      showComments: false,
      commentbtn_text: "View Comments",
      windowWidth: window.innerWidth,
      images: [],
      timestamp: "",
      showName:'',
    };
  },
  methods: {
    async viewComments() {
      console.log(this.comments);
      (this.showComments = !this.showComments),
        (this.commentbtn_text =
          this.commentbtn_text === "View Comments"
            ? "Hide Comments"
            : "View Comments");
      if (this.isAnswer) {
        await this.questionStore.SetAnswerID(this.question["_id"]);
      }
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    async AnswerClick() {
      console.log(
        "we we will be answering a question from inside a question view"
      );
      this.questionStore.SetQuestion(this.question);
      this.questionStore.SetAction(1);
      this.questionStore.SetAddImage(true);
      this.$emit("comment");
    },
    async CommentClick() {
      if (!this.isAnswer) {
        console.log(
          "we will be commenting on a question from inside a question view"
        );
        console.log("question id: " + this.question["_id"]);
        await this.questionStore.SetQuestion(this.question);
        await this.questionStore.SetAction(2);
        this.$emit("comment");
      } else {
        console.log(
          "we will be commenting on an answer from inside a question view"
        );
        await this.questionStore.SetAction(3);
        await this.questionStore.SetAnswerID(this.question["_id"]);
        this.$emit("comment");
        this.$emit("answer_id", this.question["_id"]);
      }
      await this.questionStore.SetAddImage(false);
    },
    async Upvote() {
      if (!this.isAnswer) {
        console.log(
          "we will be upvoting a question from inside a question view"
        );
        await this.questionStore.SetQuestion(this.question);
        await this.questionStore.UpvoteQuestion();
      } else {
        console.log(
          "we will be upvoting an answer from inside a question view"
        );
        await this.questionStore.SetAnswerID(this.question["_id"]);
        this.$emit("upvote");
      }
    },
    async Hide() {
      if (!this.isAnswer) {
        console.log("we will be hiding a question from inside a question view");
        await this.questionStore.SetQuestion(this.question);
        await this.questionStore.HideQuestion();
      } else {
        console.log("we will be hiding an answer from inside a question view");
        await this.questionStore.SetAnswerID(this.question["_id"]);
        this.$emit("hide");
      }
    },
    Expand(image) {
      console.log("link is : ", image);
      this.questionStore.SetImageLink(image);
      console.log("expanding");
      this.$emit("expand");
    },
    async alertClick() {
      await this.questionStore.SetShowSnackBar(true);
      await this.colourStore.SetSnackColor(false);
      await this.questionStore.SetSnackMessage("This query may have already been answered in an InfoPost or on the Questions page. Please have a careful look!");
    },
  },
  async mounted() {
    console.log("question in questionBoxMax", this.question);
    console.log("question content:", this.question.body);
    const date = new Date(this.question["asked_At"]);
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour12: true,
    };
    this.timestamp = date.toLocaleString(undefined, options);
    this.images = this.question.images;
    if (this.images.length > 0) {
      for (let i = 0; i < this.images.length; i++) {
        //D:\SMP\SMP-Portal-Backend\uploads
        console.log(this.images[i]);
        const temp =
          (import.meta.env.VITE_NODE_ENV == "DEV"
            ? "http://localhost:5000/uploads/"
            : "https://gymkhana.iitb.ac.in/newbee/uploads/") + this.images[i];
        this.images[i] = temp;
        console.log(this.images[i]);
      }
    } else {
      console.log("no images");
    }
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
    if(this.question['is_Anonymous'] == true){
        if(this.AuthStore.role == 5980 || this.AuthStore.role == 6311){
          this.showName = this.question['user_Name'];
          console.log(this.AuthStore.role)
          console.log(this.AuthStore.name)
        }
        else{
          this.showName = "Anonymous"
        }
      }
      else{
        this.showName = this.question['user_Name'];
      }
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  props: {
    question: {
      type: Object,
      required: true,
    },
    comments: {
      type: Array,
      required: true,
    },
    upvotes: {
      type: Number,
      required: true,
    },
    showAnswerBox: {
      type: Boolean,
      required: true,
    },
    isAnswer: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
.main-container {
  width: 61.53vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: start;
  width: 100%;
  height: fit-content;
}

.Upvote {
  width: 3.98%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.QuestionBox {
  width: 85.38%;
  height: fit-content;
  margin-left: 1.1vw;
  margin-right: 1.35vw;

  /* overflow: auto; */
  /* border: 1px solid #000000; */
}

.content {
  border-radius: 18px;
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 12px 16px 12px 16px;
}

.questionRoute {
  text-decoration: none;
  width: 100%;
}

.route {
  text-decoration: none;
  width: 100%;
}
.inner-container {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
}

.stamps {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.info {
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.name {
  margin-right: 16px;
  font-size: 16px;
  font-weight: 600;
}

.timestamp {
  font-size: 10px;
}

.verified {
  width: fit-content;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid;
  border-radius: 6px;
  padding-left: 8px;
  padding-right: 8px;
  padding: auto;
}

.icon {
  height: fit-content;
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
}

.images {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  width: 100%;
}

.img {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  border: 1px solid;
  margin-right: 8px;
  background: #f0f2f5;
  overflow: hidden;
  /* box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3); */
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text {
  width: fit-content;
  height: fit-content;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  white-space: pre-wrap;
  /* display: -webkit-box;
    -webkit-line-clamp: 8;
    -webkit-box-orient: vertical;  */
}

.box-footer {
  margin-top: 1.56%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.comments {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
}

.view-comments {
  border: 1px solid;
  background: none;
  width: fit-content;
  height: fit-content;
  margin-right: 1.56%;
  border-radius: 100px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  padding: 5px 10px 5px 10px;
}

.comment {
  border-radius: 100px;
  width: fit-content;
  height: fit-content;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 12px 5px 12px;
}

p {
  font-size: 16px;
  font-weight: 550;
}

.answer {
  border-radius: 100px;
  width: fit-content;
  height: fit-content;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 12px 5px 12px;
}

.alert{
  cursor: pointer;
}

.Hide {
  width: 2vw;

  cursor: pointer;
}

.Lister {
  margin-top: 1%;
  max-height: 27vh;
  width: 84.98%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  overflow-y: scroll;
  overflow-x: hidden;
}

.Lister::-webkit-scrollbar {
  width: 8px;
}

.Lister::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.Lister::-webkit-scrollbar-thumb {
  background: #888;
}

.Lister::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.comment-box {
  width: 100%;
}

.view {
  display: flex;
  width: 100%;
  align-items: top;
  justify-content: start;
  margin-left: 0%;
}
.inputComment {
  display: flex;
}

@media only screen and (max-width: 1150px) {
  .name {
    font-size: 14px;
  }

  .timestamp {
    font-size: 8px;
  }

  .verified {
    font-size: 8px;
  }

  .text {
    font-size: 10px;
  }

  .view-comments {
    font-size: 14px;
  }

  p {
    font-size: 14px;
  }
}

@media only screen and (max-width: 750px) {
  .main-container {
    width: 100%;
  }

  .QuestionBox {
    width: 100%;
    margin-left: 0px;
    margin-right: 0px;
  }

  .name {
    font-size: 12px;
  }

  .timestamp {
    font-size: 8px;
  }

  .verified {
    font-size: 6px;
  }

  .view-comments {
    font-size: 10px;
  }

  p {
    font-size: 10px;
  }

  .Upvote {
    margin-left: 18px;
    flex-direction: row;
  }

  .Hide {
    width: 8vw;
    margin-left: 8px;
  }
}
</style>

<template>
  <div class="main-container">
    <div class="container">
      <div class="Upvote" @click="Upvote" v-if="windowWidth > 750">
        <upvote
          v-if="AuthStore.role == 7669 || AuthStore.role == 1980"
          :upvotes="question.upvotes"
        />
      </div>

      <div class="QuestionBox">
        <div class="content" :style="{ background: colourStore.background }">
          <router-link
            :to="AuthStore.vite_base + '/question'"
            class="questionRoute"
            @comment="$emit('comment')"
            @click="SetQuestionView"
            @expand="$emit('expand')"
          >
            <div class="inner-container">
              <div class="stamps">
                <div class="info">
                  <div
                    class="name"
                    :style="{ color: colourStore.emphasis_text }"
                  >
                    {{ showName }}
                  </div>
                  <div class="timestamp" :style="{ color: colourStore.grey }">
                    {{ timestamp }}
                  </div>
                  <div
                    class="attached"
                    v-if="images.length > 0"
                    :style="{ color: colourStore.grey }"
                  >
                    &nbsp;&nbsp;Images Attached
                  </div>
                </div>
                <div
                  v-if="question.answers.length > 0"
                  class="verified"
                  :style="{ color: colourStore.grey }"
                >
                  <verified class="icon" />&nbsp;
                  <p>Answered</p>
                </div>
              </div>
              <div class="text" :style="{ color: colourStore.emphasis_text }">
                {{ question['body'] }}
              </div>
            </div>
          </router-link>
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
              :upvotes="question.upvotes"
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
          <router-link
            :to="AuthStore.vite_base + '/question'"
            @click="SetQuestionView"
            class="expand-route"
            @expand="$emit('expand')">
            <div
              v-if="
                showAnswerBox &&
                (AuthStore.role == 7669 || AuthStore.role == 1980)
              "
              class="expand"
              :style="{
                color: colourStore.emphasis_text,
                background: colourStore.background,
              }"
            >
              <open class="icon" />&nbsp;
              <p>Answers</p>
            </div>
          </router-link>
          <div class="Hide" v-if="windowWidth <= 750 && AuthStore.role == 5980" >
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
            />
          </div>
          <div class="alert" v-if="question['hidden']">
            <alert
              v-if="
                question['hidden'] &&
                AuthStore.role == 7669 &&
                windowWidth <= 750
              "
              @click="alertClick"
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
      <div class="Hide" v-if="windowWidth > 750">
        <eye
          v-if="AuthStore.role == 5980 && !question['hidden']"
          class="icon"
          @click="Hide"
        /><closed_eye
          v-if="AuthStore.role == 5980 && question['hidden']"
          class="icon"
          @click="Hide"
        /><alert
          v-if="
            question['hidden'] && AuthStore.role == 7669 && windowWidth > 750
          "
          @click="alertClick"
        />
      </div>
    </div>
    <div v-if="showComments" class="comment-boxes">
      <div class="Lister">
        <div
          :key="comment['id']"
          v-for="comment in question.comments"
          class="comment-box"
        >
          <viewcomments :comment="comment" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import upvote from '../common/upvote.vue';

import viewcomments from '../common/viewcomments.vue';
import verified from '../icons/new_releases.svg';
import Uparrow from '../icons/add_comment.svg';
import eye from '../icons/visibility.svg';
import closed_eye from '../icons/visibility_off.svg';
import forum from '../icons/send.svg';
import alert from '../icons/Alert.svg';
import open from '../icons/open_in_new.svg'

import { useQuestionStore } from '@/stores/question';
import { useAuthStore } from '@/stores/auth';
import { useColourStore } from '@/stores/colour';

export default {
  name: 'Question',
  components: {
    upvote,
    verified,
    Uparrow,
    eye,
    alert,
    closed_eye,
    viewcomments,
    forum,
    open,
  },
  setup() {
    const QuestionStore = useQuestionStore();
    const AuthStore = useAuthStore();
    const colourStore = useColourStore();
    return {
      QuestionStore,
      AuthStore,
      colourStore,
    };
  },
  data() {
    return {
      showComments: false,
      commentbtn_text: 'View Comments',
      windowWidth: window.innerWidth,
      timestamp: '',
      images: [],
      showName:'',
    };
  },
  methods: {
    async viewComments() {
      console.log(this.comments);
      (this.showComments = !this.showComments),
        (this.commentbtn_text =
          this.commentbtn_text === 'View Comments'
            ? 'Hide Comments'
            : 'View Comments');
      await this.QuestionStore.SetQuestionID(this.question['_id']);
    },
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    async AnswerClick() {
      console.log('we will be answering a question');
      await this.QuestionStore.SetQuestion(this.question);
      await this.QuestionStore.SetAction(1);
      await this.QuestionStore.SetAddImage(true);
      this.$emit('comment');
    },
    async CommentClick() {
      console.log('we will be commenting on a question');
      await this.QuestionStore.SetQuestion(this.question);
      await this.QuestionStore.SetAction(2);
      await this.QuestionStore.SetAddImage(false);
      this.$emit('comment');
    },
    async Upvote() {
      console.log('we will be upvoting a question');
      console.log('upvotes: ' + this.upvotes);
      await this.QuestionStore.SetQuestion(this.question);
      await this.QuestionStore.UpvoteQuestion();
      console.log('upvotes: ' + this.upvotes);
    },
    async Hide() {
      console.log('we will be hiding a question');
      await this.QuestionStore.SetQuestion(this.question);
      await this.QuestionStore.HideQuestion();
    },
    async SetQuestionView() {
      console.log(this.question);
      await this.QuestionStore.SetQuestion(this.question);
      await this.QuestionStore.SetQuestionID(this.question['_id']);
    },
    async alertClick() {
      await this.QuestionStore.SetShowSnackBar(true);
      await this.colourStore.SetSnackColor(false);
      await this.QuestionStore.SetSnackMessage(
        'This query may have already been answered in an InfoPost or on the Questions page. Please have a careful look!'
      );
    },
  },
  async mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });
    const date = new Date(this.question['asked_At']);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    this.timestamp = date.toLocaleString(undefined, options);
    this.images = this.question.images;
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
    window.removeEventListener('resize', this.onResize);
  },
  props: {
    question: {
      type: Object,
      required: true,
    },

    showAnswerBox: {
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

.attached {
  font-size: 10px;
  margin-left: 6px;
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

.text {
  width: fit-content;
  height: fit-content;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
}

.box-footer {
  margin-top: 1.56%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
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

.expand-route {
  text-decoration: none;
}
.expand{
  border-radius: 100px;
  width: fit-content;
  height: fit-content;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 12px;
  text-decoration: none;
} 


.alert {
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin-left: 16px;
}

.Hide {
  width: 2vw;
  cursor: pointer;
}

.comment-boxes {
  margin-top: 16px;
  width: 84.98%;
  max-height: 27vh;
}

.Lister {
  margin-top: 1%;
  max-height: 87.04%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  overflow-y: scroll;
  overflow-x: hidden;
}

.comment-box {
  width: 100%;
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

  .expand{
    margin-left: 20px;
  }

  .view-comments {
    font-size: 10px;
  }

  p {
    font-size: 10px;
  }

  .Upvote {
    margin-left: 16px;
    flex-direction: row;
  }

  .Hide {
    width: 8vw;
    margin-left: 8px;
  }
}
</style>

import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useQuestionStore = defineStore("question", {
    id: "question",
    state: () => ({
        question: {},
        answers: [],
        comments: [],
        question_ID : '',
        answer_ID : '',
        action : 0, // 1 is for answering a question, 2 is for commenting on a question, 3 is for commenting on an answer, 4 is for posting a question, 5 is for posting a infopost
    }),
    actions: {
        async SetQuestion(question){
            console.log('we have entered the set question function in question.js');
            this.question = question;
            this.answers = question['answers'];   
            this.comments = question['comments'];
            console.log("state variables :", this.question, this.answers, this.comments);
        },
        async SetAction(action){
            this.action = action;
            console.log("action : ", this.action);
        },
        async SetQuestionID(question_ID){
            this.question_ID = question_ID;
            console.log("question_ID : ", this.question_ID);
        },
        async SetAnswerID(answer_ID){
            this.answer_ID = answer_ID;
            console.log("answer_ID : ", this.answer_ID);
        },
        async AddAnswer(body){
            const authStore = useAuthStore();
            console.log('we have entered the add answer function in question.js');
            const uid = authStore.user_ID;
            console.log('user id  parent function: ', uid);
            const answerObj = {
                answers : {
                    user_ID : uid,
                    body : body,
                }
            }
            console.log('answer object : ', answerObj);

            const accessToken = authStore.accessToken;

            const bearer = `Bearer ${accessToken}`

            console.log('bearer : ', bearer);
            console.log('question id : ', this.question['_id']);
            console.log('Sending request');
            const res = await fetch(`api/question/answerQ/${this.question['_id']}`, {
                method : 'PATCH',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : bearer
                },
                body : JSON.stringify(answerObj)
            })

            if(res.status == 200){
                console.log('successfully added answer');
                this.answers.push(answerObj['answers']);
            }
            else{
                if(res.status === 403){
                    console.log('refreshing token');
                    const res = await this.authStore.Refresh();
      
                    if(res.status === 200){
                        console.log('refreshed token');
                        const bearer = `Bearer ${this.authStore.accessToken}`
                        console.log('new bearer : ', bearer);
                        const res = await fetch(`api/question/answerQ/${this.question['_id']}`,{
                            method : 'PATCH',
                            headers : {
                                'Content-Type' : 'application/json',
                                'Authorization' : bearer
                            },
                            body : JSON.stringify(answerObj)
                        })
                        console.log('new request sent');
                        const data = await res.json()
                        console.log(data);
                        return data
                    }
                    else{
                        console.log('refresh failed');
                        await this.authStore.Logout()
                    }
                }
                else{
                    alert('not enough permissions')
                    await this.authStore.Logout() 
                }
            }
        },
        async AddCommentQuestion(body){
            const authStore = useAuthStore();
            console.log('we have entered the add comment on a question function in question.js');
            const uid = authStore.user_ID;
            console.log('user id  parent function: ', uid);
            const commentObj = {
                comments : {
                    user_ID : uid,
                    body : body,
                }
            }
            console.log('comment object : ', commentObj);

            const accessToken = authStore.accessToken;

            const bearer = `Bearer ${accessToken}`

            console.log('bearer : ', bearer);
            console.log('question id : ', this.question['_id']);
            console.log('Sending request');
            const res = await fetch(`api/question/commentQ/${this.question['_id']}`, {
                method : 'PATCH',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : bearer
                },
                body : JSON.stringify(commentObj)
            })

            if(res.status == 200){
                console.log('successfully added comment on question');
                this.answers.push(commentObj['comment']);
            }
            else{
                if(res.status === 403){
                    console.log('refreshing token');
                    const res = await this.authStore.Refresh();
      
                    if(res.status === 200){
                        console.log('refreshed token');
                        const bearer = `Bearer ${this.authStore.accessToken}`
                        console.log('new bearer : ', bearer);
                        const res = await fetch(`api/question/commentQ/${this.question['_id']}`,{
                            method : 'PATCH',
                            headers : {
                                'Content-Type' : 'application/json',
                                'Authorization' : bearer
                            },
                            body : JSON.stringify(commentObj)
                        })
                        console.log('new request sent');
                        const data = await res.json()
                        console.log(data);
                        return data
                    }
                    else{
                        console.log('refresh failed');
                        await this.authStore.Logout()
                    }
                }
                else{
                    alert('not enough permissions')
                    await this.authStore.Logout() 
                }
            }
        },
        async AddCommentAnswer(body){
            const authStore = useAuthStore();
            console.log('we have entered the add comment on an answer function in question.js');
            const uid = authStore.user_ID;
            console.log('user id  parent function: ', uid);
            const commentObj = {
                answers : {
                    comments : {
                        user_ID : uid,
                        body : body,
                    }
                }
            }
            console.log('comment object : ', commentObj);

            const accessToken = authStore.accessToken;

            const bearer = `Bearer ${accessToken}`

            console.log('bearer : ', bearer);
            console.log('question id : ', this.question['_id']);
            console.log('Sending request');
            const res = await fetch(`api/question/commentA/${this.question_ID}/${this.answer_ID}`, {
                method : 'PATCH',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : bearer
                },
                body : JSON.stringify(commentObj)
            })

            if(res.status == 200){
                console.log('successfully added comment on answer :', this.answer_ID);
                this.answers.push(commentObj['answers']['comments']);
            }
            else{
                if(res.status === 403){
                    console.log('refreshing token');
                    const res = await this.authStore.Refresh();
      
                    if(res.status === 200){
                        console.log('refreshed token');
                        const bearer = `Bearer ${this.authStore.accessToken}`
                        console.log('new bearer : ', bearer);
                        const res = await fetch(`api/question/commentA/${this.question_ID}/${this.answer_ID}`,{
                            method : 'PATCH',
                            headers : {
                                'Content-Type' : 'application/json',
                                'Authorization' : bearer
                            },
                            body : JSON.stringify(commentObj)
                        })
                        console.log('new request sent');
                        const data = await res.json()
                        console.log(data);
                        return data
                    }
                    else{
                        console.log('refresh failed');
                        await this.authStore.Logout()
                    }
                }
                else{
                    alert('not enough permissions')
                    await this.authStore.Logout() 
                }
            }
        },
        async UpvoteQuestion(){
            const authStore = useAuthStore();
            console.log('we have entered the upvote a question function in question.js', this.question['_id']);
            const uid = authStore.user_ID;
            console.log('user id  parent function: ', uid);
            const upvoteObj = {
                user_ID : uid,
            }
            console.log('upvote object : ', upvoteObj);

            const accessToken = authStore.accessToken;

            const bearer = `Bearer ${accessToken}`

            console.log('bearer : ', bearer);
            console.log('question id : ', this.question['_id']);
            console.log('Sending request');
            const res = await fetch(`api/question/upvoteQ/${this.question['_id']}`, {
                method : 'PATCH',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : bearer
                },
                body : JSON.stringify(upvoteObj)
            })

            if(res.status == 200){
                console.log('successfully upvotes on question :', this.question['_id']);
            }
            else{
                if(res.status === 403){
                    console.log('refreshing token');
                    const res = await this.authStore.Refresh();
      
                    if(res.status === 200){
                        console.log('refreshed token');
                        const bearer = `Bearer ${this.authStore.accessToken}`
                        console.log('new bearer : ', bearer);
                        const res = await fetch(`api/question/upvoteQ/${this.question['_id']}`,{
                            method : 'PATCH',
                            headers : {
                                'Content-Type' : 'application/json',
                                'Authorization' : bearer
                            },
                            body : JSON.stringify(upvoteObj)
                        })
                        console.log('new request sent');
                        const data = await res.json()
                        console.log(data);
                        return data
                    }
                    else{
                        console.log('refresh failed');
                        await this.authStore.Logout()
                    }
                }
                else{
                    alert('not enough permissions')
                    await this.authStore.Logout() 
                }
            }
        }
    }
})
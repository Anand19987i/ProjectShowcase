string removeDuplicateLetters(string s) {
        map<char, int> store;
        for(int i = 0; i<s.size(); i++){
            store[s[i]]++;
        }

        stack<char> stk;
        set<char> inStk;
        
        for(int i = 0; i<s.size(); i++){
            if(inStk.find(s[i]) != inStk.end()){
                store[s[i]]--;
                continue;
            }
            while(!stk.empty() && store[stk.top()] > 0 && stk.top() > s[i]){
                inStk.erase(stk.top());
                stk.pop();
            }
            stk.push(s[i]);
            store[s[i]]--;
            inStk.insert(s[i]);
        }
        string res = "";
        while(!stk.empty()){
            res += stk.top();
            stk.pop();
        }
        reverse(res.begin(), res.end());
        return res;
    }
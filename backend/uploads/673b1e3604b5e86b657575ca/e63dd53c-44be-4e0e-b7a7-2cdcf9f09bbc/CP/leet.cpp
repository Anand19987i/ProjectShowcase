#include "bits/stdc++.h"
using namespace std;

long long minimumRemoval(vector<int>& arr) {
	sort(arr.begin(), arr.end());
	long long ans = INT_MAX, sum = 0;
	int n = arr.size();
	for (long long x : arr)
		sum += x; 
	for (int i = 0; i < n; i++) {
		ans = min((sum - (n - i) * arr[i]), ans);
	}
	return ans;
}

int main () {
	vector<int> arr = {4, 1, 5, 6};
	cout << minimumRemoval(arr);
}
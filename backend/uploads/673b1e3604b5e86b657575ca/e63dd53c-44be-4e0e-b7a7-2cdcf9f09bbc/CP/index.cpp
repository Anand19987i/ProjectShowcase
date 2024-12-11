#include <bits/stdc++.h>
using namespace std;


void gameOfLife(vector<vector<int>>& arr) {
	int n = arr.size();
	int m = arr[0].size();
	int ones = 0, zeroes = 0;
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (arr[i][j] == 1) ones++;
			if (arr[i][j] == 0) zeroes++;
			}
		}

	cout << ones << " " << zeroes << "\n";
	for (auto &x : arr) {
		for (int y : x) {
			cout << y <<  " ";		
		}
		cout << "\n";
	}
}

int main () {
	vector<vector<int>> arr = {{0, 1, 0}, {0, 0, 1}, {1, 1, 1}, {0, 0, 0}};
	gameOfLife(arr);
}
package com.medtrixhealthcare.MSCM2016;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;

import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.StrictMode;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
//import android.view.WindowManager;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebSettings.RenderPriority;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.google.android.gcm.GCMRegistrar;
import com.medtrixhealthcare.MSCM2016.JSInterface.callBacks;

@SuppressLint({ "SetJavaScriptEnabled", "SdCardPath" })
public class Application extends Activity implements callBacks {
	
	public static WebView webView = null;
	public static WebView networkView = null;
	public static String registrationId = "";
	private String TAG = "Conference App";
	private Handler handler = new Handler();
	
	final Context context = this;
	final JSInterface _jsInterface = new JSInterface(context, Application.this);
	
	public static String PACKAGE_NAME = null;
	
	private int NETWORK_INTERVAL = 25000;
	
	private boolean appReload = true;
	private static String noInternetUrl = "file:///android_asset/source/NoInternet/internet.html";
	
	public void log(String stacktrace) {
		try {
			BufferedWriter bos = new BufferedWriter(new FileWriter(Environment.getExternalStorageDirectory().getPath()
					+ "/conferenceapp/conferenceapp.log", true));
			bos.write(stacktrace);
			bos.newLine();
			bos.write("\r\n");
			bos.flush();
			bos.close();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private BroadcastReceiver mDeviceTokenReceiver = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) {
			// Get extra data included in the Intent
			
			String devicetoken = intent.getStringExtra("token");
			log("Device token received : " + devicetoken);
			// Log.d("receiver", "Got message: " + message);
			if (webView != null) {
				webView.loadUrl("javascript:SetDeviceToken('" + devicetoken + "')");
			}
			Application.registrationId = devicetoken;
		}
	};
	
	private BroadcastReceiver mMessageReceiver = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) {
			String message = intent.getStringExtra("message");
			Bundle extras = intent.getExtras();
			log("Got message : " + message);
			if (webView != null) {
				log("Invoking javascript...");
				JSONObject json;
				try {
					json = new JSONObject();
					json.put("message", message);
					json.put("type", extras.getString("type"));
					json.put("title", extras.getString("title"));
					json.put("page", extras.getString("page"));
					log(json.toString());
					webView.loadUrl("javascript:onPushNotification('" + json + "')");
				}
				catch (JSONException e) {
					e.printStackTrace();
				}
				
			}
		}
	};
	
	@SuppressLint("SdCardPath")
	@SuppressWarnings("deprecation")
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		
		final Thread.UncaughtExceptionHandler defaultHandler = Thread.getDefaultUncaughtExceptionHandler();
		Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {
			@Override
			public void uncaughtException(Thread thread, Throwable throwable) {
				defaultHandler.uncaughtException(thread, throwable);
			}
		});
		
		super.onCreate(savedInstanceState);
		
		PACKAGE_NAME = getApplicationContext().getPackageName();
		
		LocalBroadcastManager.getInstance(this).registerReceiver(mDeviceTokenReceiver,
				new IntentFilter("DEVICE_TOKEN_RECEIVED"));
		LocalBroadcastManager.getInstance(this)
				.registerReceiver(mMessageReceiver, new IntentFilter("MESSAGE_RECEIVED"));
		
		GCMRegistrar.checkDevice(this);
		GCMRegistrar.checkManifest(this);
		GCMRegistrar.unregister(this);
		
		setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);
		//this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
				//WindowManager.LayoutParams.FLAG_FULLSCREEN);
		
		setContentView(R.layout.main_activity);
		
		if (android.os.Build.VERSION.SDK_INT > 9) {
			StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
			StrictMode.setThreadPolicy(policy);
		}
		
		handler.postDelayed(new Runnable() {
			public void run() {
				hasInternetAccess(context);
				handler.postDelayed(this, NETWORK_INTERVAL);
			}
		}, 100);
		
		webView = (WebView) findViewById(R.id.appWebview);
		networkView = (WebView) findViewById(R.id.networkWebview);
		
		try {
			
			webView.clearCache(true);
			
			WebSettings webSettings = webView.getSettings();
			
			// Set WebView Background color as Black
			webView.setBackgroundColor(Color.parseColor("#000000"));
			
			// JS and image Option
			webSettings.setJavaScriptEnabled(true);
			webSettings.setDomStorageEnabled(true);
			webSettings.setLoadsImagesAutomatically(true);
			
			// Database Option
			webSettings.setDatabaseEnabled(true);
			webSettings.setDatabasePath("/data/data/" + PACKAGE_NAME + "/databases");
			
			// File access option
			webSettings.setAllowFileAccess(true);
			webSettings.setAllowContentAccess(true);
			webSettings.setAllowFileAccessFromFileURLs(true);
			webSettings.setAllowUniversalAccessFromFileURLs(true);
			
			// Render priority
			webSettings.setRenderPriority(RenderPriority.HIGH);
			//webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);
			
			// Zoom Control
			webSettings.setSupportZoom(false);
			webSettings.setBuiltInZoomControls(false);
			webSettings.setDisplayZoomControls(false);
			webSettings.setLoadWithOverviewMode(true);
			webSettings.setUseWideViewPort(false);
			
			// Scroll bar style
			webView.setHorizontalScrollBarEnabled(false);
			webView.setScrollBarStyle(View.SCROLLBARS_OUTSIDE_OVERLAY);
			
			// JavaScript Interface
			webView.addJavascriptInterface(_jsInterface, "androidInterface");
			
			// Web client
			webView.setWebViewClient(new WebViewClient() {
				@Override
				public void onPageStarted(WebView view, String url, Bitmap favicon) {
					super.onPageStarted(view, url, favicon);
				}
				
				@Override
				public void onPageFinished(WebView view, String url) {
					super.onPageFinished(view, url);
					view.loadUrl("javascript:SetDeviceToken('" + Application.registrationId + "')");
				}
			});
			
			// WebChrome client
			webView.setWebChromeClient(new WebChromeClient() {
				@Override
				public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
					return super.onJsAlert(view, url, message, result);
				}
				
				public void onConsoleMessage(String message, int lineNumber, String sourceID) {
					Log.d(TAG, message);
				}
			});
			
			// Load HTML Page
			if (savedInstanceState == null) {
				File file = new File("/data/data/" + getPackageName() + "/");
				webView.loadUrl("file:///" + file + "/index.html");
				//webView.loadUrl("file:///android_asset/source/index.html");
				networkView.loadUrl(noInternetUrl);
				
				registrationId = GCMRegistrar.getRegistrationId(this);
				if (registrationId.equals("")) {
					GCMRegistrar.register(Application.this, GCMIntentService.SENDER_ID);
					registrationId = GCMRegistrar.getRegistrationId(this);
				}
			}
		}
		catch (Exception ex) {
			Log.d(TAG, ex.getCause().toString());
		}
	}
	
	@Override
	protected void onDestroy() {
		LocalBroadcastManager.getInstance(this).unregisterReceiver(mDeviceTokenReceiver);
		LocalBroadcastManager.getInstance(this).unregisterReceiver(mMessageReceiver);
		super.onDestroy();
		this.finish();
	}
	
	@Override
	protected void onSaveInstanceState(Bundle outState) {
		super.onSaveInstanceState(outState);
		webView.saveState(outState);
	}
	
	@Override
	protected void onRestoreInstanceState(Bundle savedInstanceState) {
		super.onRestoreInstanceState(savedInstanceState);
		webView.restoreState(savedInstanceState);
	}
	
	@Override
	protected void onStart() {
		super.onStart();
	}
	
	@Override
	public void onStop() {
		super.onStop();
	}
	
	@Override
	public void onPause() {
		super.onPause();
	}
	
	// Handle Device BackPress for loading previous web page or exit the
	// application.
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if (keyCode == KeyEvent.KEYCODE_BACK) {
			finish();
		}
		else {
			return false;
		}
		return super.onKeyDown(keyCode, event);
	}
	
	@Override
	public void SendFileSize(int size) {
		
	}
	
	private void hasInternetAccess(Context context) {
		if (isOnline()) {
			Log.i(TAG, "Network available");
			if (appReload) {
				File file = new File("/data/data/" + PACKAGE_NAME + "/");
				webView.loadUrl("file:///" + file + "/index.html");
				//webView.loadUrl("file:///android_asset/source/index.html");
				appReload = false;
			}
			networkView.setVisibility(View.GONE);
			webView.setVisibility(View.VISIBLE);
		}
		else {
			Log.i(TAG, "Network not available");
			webView.setVisibility(View.GONE);
			networkView.setVisibility(View.VISIBLE);
		}
	}
	
	public boolean isOnline() {
		try {
			ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
			NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
			if (activeNetwork != null && activeNetwork.isConnectedOrConnecting()) {
				return activeNetwork.isConnected();
			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
}

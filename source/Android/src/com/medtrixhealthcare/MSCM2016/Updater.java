package com.medtrixhealthcare.MSCM2016;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebSettings.RenderPriority;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.medtrixhealthcare.MSCM2016.R;
import com.medtrixhealthcare.MSCM2016.JSInterface.callBacks;
import com.omnificence.utils.CopyAssets;

@SuppressLint("SdCardPath")
public class Updater extends Activity implements callBacks {
	
	public static WebView webView = null;
	private String TAG = "Conference App";
	private Handler handler = new Handler();
	
	final Context context = this;
	final JSInterface _jsInterface = new JSInterface(context, Updater.this);
	
	private boolean firstLaunch = false;
	CopyAssets copier = new CopyAssets(Updater.this);
	
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
	
	@SuppressLint({ "SetJavaScriptEnabled", "SdCardPath", "NewApi" })
	@SuppressWarnings({ "deprecation" })
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		
		final Thread.UncaughtExceptionHandler defaultHandler = Thread.getDefaultUncaughtExceptionHandler();
		Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {
			@Override
			public void uncaughtException(Thread thread, Throwable throwable) {
				defaultHandler.uncaughtException(thread, throwable);
			}
		});
		
		onFirstLaunch();
		
		super.onCreate(savedInstanceState);
		
		setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);
		this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
				WindowManager.LayoutParams.FLAG_FULLSCREEN);
		
		setContentView(R.layout.updater_activity);
		
		webView = (WebView) findViewById(R.id.updaterWebview);
		
		try {
			
			webView.clearCache(true);
			
			WebSettings webSettings = webView.getSettings();
			
			// Set WebView Background color as Black
			webView.setBackgroundColor(Color.parseColor("#000000"));
			
			// Set debugging enabled
			// webView.setWebContentsDebuggingEnabled(true);
			
			// JS and image Option
			webSettings.setJavaScriptEnabled(true);
			webSettings.setDomStorageEnabled(true);
			webSettings.setLoadsImagesAutomatically(true);
			
			// Database Option
			webSettings.setDatabaseEnabled(true);
			webSettings.setDatabasePath("/data/data/" + getApplicationContext().getPackageName() + "/databases");
			
			// File access option
			webSettings.setAllowFileAccess(true);
			webSettings.setAllowContentAccess(true);
			webSettings.setAllowFileAccessFromFileURLs(true);
			webSettings.setAllowUniversalAccessFromFileURLs(true);
			
			// Render priority
			webSettings.setRenderPriority(RenderPriority.HIGH);
			webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);
			
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
				webView.loadUrl("file:///" + file + "/update.html");
			}
		}
		catch (Exception ex) {
			Log.d(TAG, ex.getCause().toString());
		}
	}
	
	@Override
	protected void onDestroy() {
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
	public void SendFileSize(final int size) {
		try {
			handler.post(new Runnable() {
				public void run() {
					webView.loadUrl("javascript:setFileSize('" + size + "')");
				}
			});
		}
		catch (Exception Ex) {
		}
	}
	
	@SuppressLint("SdCardPath")
	private void onFirstLaunch() {
		SharedPreferences pref = this.getSharedPreferences("firstRun", Context.MODE_PRIVATE);
		firstLaunch = pref.getBoolean("Launched", true);
		if (firstLaunch) {
			SharedPreferences.Editor editor = pref.edit();
			editor.putBoolean("Launched", false);
			editor.commit();
			
			String toPath = "/data/data/" + getPackageName();
			
			copier.copyAssetFolder(getAssets(), "source", toPath);
		}
	}
}
